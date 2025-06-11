import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, CalendarPlus, Check } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import { createEvent, rsvpEvent } from "@/utils/programUtils";

interface Event {
  id: number;
  communityId: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  attendees: number;
  maxAttendees?: number;
  creator: string;
  image?: string;
  userRsvped?: boolean;
}

const Events = () => {
  const navigate = useNavigate();
  const { wallet, publicKey, connected } = useWallet();
  
  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      communityId: "naruto-community",
      title: "Naruto Movie Marathon",
      description: "Join us for a marathon of Naruto movies! We'll be watching The Last: Naruto the Movie and Boruto: Naruto the Movie back-to-back.",
      date: new Date(Date.now() + 86400000 * 7), // 7 days from now
      location: "Virtual - Discord",
      attendees: 42,
      maxAttendees: 100,
      creator: "5XnY...wAJb",
      image: "/events/naruto-event.jpg",
    },
    {
      id: 2,
      communityId: "one-piece-community",
      title: "One Piece Manga Discussion",
      description: "Let's discuss the latest chapters of One Piece and theories about the final saga!",
      date: new Date(Date.now() + 86400000 * 3), // 3 days from now
      location: "Virtual - Zoom",
      attendees: 28,
      creator: "7ZpQ...mNkR",
      image: "/events/one-piece-event.jpg",
    },
    {
      id: 3,
      communityId: "anime-general",
      title: "Anime Convention Meetup",
      description: "Meeting up at AnimeExpo 2023! Let's gather at the main entrance and explore the convention together.",
      date: new Date(Date.now() + 86400000 * 30), // 30 days from now
      location: "Los Angeles Convention Center",
      attendees: 15,
      maxAttendees: 20,
      creator: "3RtF...pQxZ",
      image: "/events/convention-event.jpg",
    },
  ]);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    communityId: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert("Please connect your wallet to create an event");
      return;
    }
    
    if (!newEvent.title || !newEvent.communityId || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location) {
      alert("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const eventId = Date.now();
      const timestamp = new Date(`${newEvent.date}T${newEvent.time}`).getTime();
      
      await createEvent(
        eventId,
        newEvent.communityId,
        newEvent.title,
        newEvent.description,
        timestamp,
        wallet
      );
      
      // Add to local state (in a real app, you'd fetch from blockchain)
      setEvents([
        {
          id: eventId,
          communityId: newEvent.communityId,
          title: newEvent.title,
          description: newEvent.description,
          date: new Date(timestamp),
          location: newEvent.location,
          attendees: 0,
          creator: publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4),
        },
        ...events,
      ]);
      
      setNewEvent({
        title: "",
        communityId: "",
        description: "",
        date: "",
        time: "",
        location: "",
      });
      setShowNewEventForm(false);
    } catch (error) {
      console.error("Error creating event:", error);
      alert(`Failed to create event: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRsvp = async (eventId: number) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet to RSVP");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await rsvpEvent(eventId, wallet);
      
      // Update local state (in a real app, you'd fetch from blockchain)
      setEvents(events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: event.attendees + 1,
            userRsvped: true,
          };
        }
        return event;
      }));
    } catch (error) {
      console.error("Error RSVPing to event:", error);
      alert(`Failed to RSVP: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  const isEventFull = (event: Event) => {
    return event.maxAttendees !== undefined && event.attendees >= event.maxAttendees;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18142b] to-[#2c225a]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Community Events</h1>
          <Button 
            onClick={() => setShowNewEventForm(!showNewEventForm)}
            className="bg-[#6c47ff] hover:bg-[#7c5aff]"
          >
            {showNewEventForm ? "Cancel" : "Create Event"}
          </Button>
        </div>
        
        {showNewEventForm && (
          <Card className="mb-8 bg-white/10 backdrop-blur-lg border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Create New Event</CardTitle>
              <CardDescription className="text-white/70">
                Host a new event for the OtakuVerse community.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateEvent}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Event Title</label>
                  <Input
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="bg-white/20 border-white/10 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Community ID</label>
                  <Input
                    placeholder="Enter community ID (e.g., naruto-community)"
                    value={newEvent.communityId}
                    onChange={(e) => setNewEvent({ ...newEvent, communityId: e.target.value })}
                    className="bg-white/20 border-white/10 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Description</label>
                  <Textarea
                    placeholder="Describe your event"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="bg-white/20 border-white/10 text-white min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Date</label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="bg-white/20 border-white/10 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Time</label>
                    <Input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="bg-white/20 border-white/10 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Location</label>
                  <Input
                    placeholder="Virtual or physical location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="bg-white/20 border-white/10 text-white"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-[#6c47ff] hover:bg-[#7c5aff]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden flex flex-col">
              {event.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/800x400/6c47ff/FFFFFF?text=Event";
                    }}
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{event.title}</CardTitle>
                    <CardDescription className="text-white/70">
                      Hosted by {event.creator}
                    </CardDescription>
                  </div>
                  <Badge className="bg-[#6c47ff]">{event.communityId}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="text-white/80 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/70">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.attendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ""} attendees
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                {event.userRsvped ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700 cursor-default flex items-center gap-2">
                    <Check className="w-4 h-4" /> You're attending
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-[#6c47ff] hover:bg-[#7c5aff] flex items-center gap-2" 
                    onClick={() => handleRsvp(event.id)}
                    disabled={isSubmitting || isEventFull(event)}
                  >
                    <CalendarPlus className="w-4 h-4" />
                    {isEventFull(event) ? "Event Full" : "RSVP"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-12 text-white/60">
            No events found. Create an event to get started.
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;