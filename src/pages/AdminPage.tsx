import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import {
  CalendarDays,
  Users,
  Phone,
  Mail,
  Check,
  X,
  Loader2,
  LogIn,
  Eye,
  Clock,
  DollarSign,
  Bell,
  BellOff,
} from "lucide-react";

interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  special_requests: string | null;
  status: string;
  total_price: number | null;
  created_at: string;
  rooms?: { name: string };
}

interface Room {
  id: string;
  name: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const { isSupported: pushSupported, token: pushToken } = usePushNotifications();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  // Simple password protection (for demo - in production use proper auth)
  const ADMIN_PASSWORD = "admin123"; // Change this!

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      toast({ title: "Invalid password", variant: "destructive" });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, roomsRes] = await Promise.all([
      supabase
        .from("bookings")
        .select("*, rooms(name)")
        .order("created_at", { ascending: false }),
      supabase.from("rooms").select("id, name"),
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (roomsRes.data) setRooms(roomsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Set up real-time subscription
    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Failed to update booking", variant: "destructive" });
    } else {
      toast({ title: `Booking ${status}` });
      fetchData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-accent text-accent-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-gold text-charcoal";
    }
  };

  const filteredBookings = bookings.filter((b) =>
    filter === "all" ? true : b.status === filter
  );

  const todayCheckIns = bookings.filter(
    (b) => isToday(parseISO(b.check_in)) && b.status === "confirmed"
  );
  const todayCheckOuts = bookings.filter(
    (b) => isToday(parseISO(b.check_out)) && b.status === "confirmed"
  );
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-24 bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Default password: admin123 (change this in production)
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 bg-background">
      {/* Header */}
      <section className="py-8 bg-secondary">
        <div className="container-wide mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">Booking Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage reservations and track bookings</p>
            </div>
            {/* Push Notification Status */}
            <div className="flex items-center gap-2">
              {pushSupported ? (
                pushToken ? (
                  <Badge className="bg-accent text-accent-foreground flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    Push Enabled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BellOff className="w-3 h-3" />
                    Enabling Push...
                  </Badge>
                )
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <BellOff className="w-3 h-3" />
                  Push: Use Mobile App
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today Check-ins</p>
                    <p className="text-2xl font-semibold">{todayCheckIns.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today Check-outs</p>
                    <p className="text-2xl font-semibold">{todayCheckOuts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-semibold">{pendingBookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-semibold">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
                {status !== "all" && (
                  <span className="ml-2 text-xs opacity-70">
                    ({bookings.filter((b) => b.status === status).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Bookings Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.guest_name}</p>
                              <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{booking.rooms?.name || "Unknown"}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{format(parseISO(booking.check_in), "MMM d")} - {format(parseISO(booking.check_out), "MMM d, yyyy")}</p>
                              <p className="text-muted-foreground">{booking.guests_count} guest(s)</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${booking.total_price || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedBooking(booking)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle className="font-serif">Booking Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedBooking && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Guest Name</Label>
                                          <p className="font-medium">{selectedBooking.guest_name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Room</Label>
                                          <p className="font-medium">{selectedBooking.rooms?.name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Email</Label>
                                          <a href={`mailto:${selectedBooking.guest_email}`} className="text-primary hover:underline flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {selectedBooking.guest_email}
                                          </a>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Phone</Label>
                                          <a href={`https://wa.me/${selectedBooking.guest_phone.replace(/\D/g, "")}`} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {selectedBooking.guest_phone}
                                          </a>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Check-in</Label>
                                          <p className="font-medium">{format(parseISO(selectedBooking.check_in), "PPP")}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Check-out</Label>
                                          <p className="font-medium">{format(parseISO(selectedBooking.check_out), "PPP")}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Guests</Label>
                                          <p className="font-medium flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {selectedBooking.guests_count}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Total Price</Label>
                                          <p className="font-medium text-primary">${selectedBooking.total_price}</p>
                                        </div>
                                      </div>
                                      {selectedBooking.special_requests && (
                                        <div>
                                          <Label className="text-muted-foreground text-sm">Special Requests</Label>
                                          <p className="p-3 bg-secondary rounded-lg text-sm">{selectedBooking.special_requests}</p>
                                        </div>
                                      )}
                                      <div>
                                        <Label className="text-muted-foreground text-sm">Booked On</Label>
                                        <p className="text-sm">{format(parseISO(selectedBooking.created_at), "PPP 'at' p")}</p>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-accent hover:text-accent"
                                    onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default AdminPage;