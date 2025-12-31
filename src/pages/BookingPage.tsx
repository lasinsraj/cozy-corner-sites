import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays, addDays, isBefore, isWithinInterval } from "date-fns";
import { CalendarIcon, Users, Check, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";

interface Room {
  id: string;
  name: string;
  price: number;
  capacity: number;
  description: string;
  features: string[];
}

interface Booking {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
}

const bookingSchema = z.object({
  guest_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  guest_email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  guest_phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(20, "Phone must be less than 20 characters"),
  special_requests: z.string().max(500, "Special requests must be less than 500 characters").optional(),
});

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    special_requests: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  useEffect(() => {
    const roomId = searchParams.get("room");
    if (roomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === roomId);
      if (room) setSelectedRoom(room);
    }
  }, [searchParams, rooms]);

  const fetchRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) {
      console.error("Error fetching rooms:", error);
      toast({ title: "Error loading rooms", variant: "destructive" });
    } else {
      setRooms(data || []);
    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("id, room_id, check_in, check_out")
      .neq("status", "cancelled");
    if (!error) {
      setBookings(data || []);
    }
  };

  const isDateBooked = (date: Date, roomId: string) => {
    return bookings.some(booking => {
      if (booking.room_id !== roomId) return false;
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);
      return isWithinInterval(date, { start, end: addDays(end, -1) });
    });
  };

  const isDateDisabled = (date: Date) => {
    if (isBefore(date, new Date())) return true;
    if (selectedRoom && isDateBooked(date, selectedRoom.id)) return true;
    return false;
  };

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = selectedRoom ? nights * selectedRoom.price : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = bookingSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    if (!selectedRoom || !checkIn || !checkOut || nights < 1) {
      toast({ title: "Please select room and dates", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        room_id: selectedRoom.id,
        guest_name: formData.guest_name.trim(),
        guest_email: formData.guest_email.trim(),
        guest_phone: formData.guest_phone.trim(),
        check_in: format(checkIn, "yyyy-MM-dd"),
        check_out: format(checkOut, "yyyy-MM-dd"),
        guests_count: guestCount,
        special_requests: formData.special_requests.trim() || null,
        total_price: totalPrice,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Booking error:", error);
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Trigger WhatsApp notification
    try {
      await supabase.functions.invoke("notify-booking", {
        body: {
          booking_id: data.id,
          guest_name: formData.guest_name,
          guest_phone: formData.guest_phone,
          room_name: selectedRoom.name,
          check_in: format(checkIn, "PPP"),
          check_out: format(checkOut, "PPP"),
          total_price: totalPrice,
        },
      });
    } catch (notifyError) {
      console.log("Notification sent or pending");
    }

    setBookingRef(data.id.slice(0, 8).toUpperCase());
    setBookingComplete(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (bookingComplete) {
    return (
      <main className="min-h-screen pt-24 bg-background">
        <div className="container-wide mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto bg-card rounded-2xl p-8 shadow-card">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-serif text-3xl text-card-foreground mb-4">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your booking reference is <span className="font-semibold text-foreground">#{bookingRef}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You will receive a WhatsApp confirmation shortly. Our team will contact you to confirm your reservation.
            </p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 bg-background">
      {/* Header */}
      <section className="py-12 bg-secondary">
        <div className="container-wide mx-auto px-4">
          <Link to="/rooms" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">Book Your Stay</h1>
          <p className="text-muted-foreground mt-2">Select your room, dates, and complete your reservation</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Room Selection & Calendar */}
            <div className="lg:col-span-2 space-y-8">
              {/* Room Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Select Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => {
                          setSelectedRoom(room);
                          setCheckIn(undefined);
                          setCheckOut(undefined);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedRoom?.id === room.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <h3 className="font-serif text-lg text-card-foreground mb-1">{room.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Up to {room.capacity} guests</p>
                        <p className="font-semibold text-primary">${room.price}/night</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Date Selection */}
              {selectedRoom && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Select Dates
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      <span className="inline-block w-3 h-3 bg-destructive/30 rounded mr-2" />
                      Unavailable dates
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2 block">Check-in Date</Label>
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={(date) => {
                            setCheckIn(date);
                            if (checkOut && date && isBefore(checkOut, addDays(date, 1))) {
                              setCheckOut(undefined);
                            }
                          }}
                          disabled={isDateDisabled}
                          className="rounded-xl border pointer-events-auto"
                          modifiers={{
                            booked: (date) => selectedRoom ? isDateBooked(date, selectedRoom.id) : false,
                          }}
                          modifiersStyles={{
                            booked: { backgroundColor: "hsl(var(--destructive) / 0.3)", color: "hsl(var(--destructive))" },
                          }}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Check-out Date</Label>
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => {
                            if (!checkIn) return true;
                            if (isBefore(date, addDays(checkIn, 1))) return true;
                            return isDateDisabled(date);
                          }}
                          className="rounded-xl border pointer-events-auto"
                          modifiers={{
                            booked: (date) => selectedRoom ? isDateBooked(date, selectedRoom.id) : false,
                          }}
                          modifiersStyles={{
                            booked: { backgroundColor: "hsl(var(--destructive) / 0.3)", color: "hsl(var(--destructive))" },
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Guest Details */}
              {selectedRoom && checkIn && checkOut && nights > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Guest Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest_name">Full Name *</Label>
                          <Input
                            id="guest_name"
                            name="guest_name"
                            value={formData.guest_name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                          />
                          {formErrors.guest_name && (
                            <p className="text-sm text-destructive">{formErrors.guest_name}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guest_email">Email *</Label>
                          <Input
                            id="guest_email"
                            name="guest_email"
                            type="email"
                            value={formData.guest_email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                          />
                          {formErrors.guest_email && (
                            <p className="text-sm text-destructive">{formErrors.guest_email}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest_phone">Phone / WhatsApp *</Label>
                          <Input
                            id="guest_phone"
                            name="guest_phone"
                            value={formData.guest_phone}
                            onChange={handleInputChange}
                            placeholder="+1 234 567 8900"
                            required
                          />
                          {formErrors.guest_phone && (
                            <p className="text-sm text-destructive">{formErrors.guest_phone}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guests_count">Number of Guests</Label>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <Input
                              id="guests_count"
                              type="number"
                              min={1}
                              max={selectedRoom.capacity}
                              value={guestCount}
                              onChange={(e) => setGuestCount(Number(e.target.value))}
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">
                              (max {selectedRoom.capacity})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                        <Textarea
                          id="special_requests"
                          name="special_requests"
                          value={formData.special_requests}
                          onChange={handleInputChange}
                          placeholder="Any special requirements or requests..."
                          rows={3}
                        />
                        {formErrors.special_requests && (
                          <p className="text-sm text-destructive">{formErrors.special_requests}</p>
                        )}
                      </div>
                      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Confirm Booking - $${totalPrice}`
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedRoom ? (
                      <>
                        <div className="pb-4 border-b border-border">
                          <h3 className="font-serif text-lg text-card-foreground">{selectedRoom.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedRoom.features?.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {checkIn && checkOut && nights > 0 && (
                          <>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Check-in</span>
                                <span className="font-medium">{format(checkIn, "EEE, MMM d, yyyy")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Check-out</span>
                                <span className="font-medium">{format(checkOut, "EEE, MMM d, yyyy")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-medium">{nights} night{nights > 1 ? "s" : ""}</span>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-border">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">
                                  ${selectedRoom.price} × {nights} nights
                                </span>
                                <span>${totalPrice}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span className="text-primary">${totalPrice}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground text-sm">Select a room to see booking details</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;