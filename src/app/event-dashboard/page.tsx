"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, CalendarX, CalendarClock, FileDigit } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
}

type User = {
  id: string;
  email: string;
};

const eventQuotes = [
  "An event is not over until everyone stops talking about it.",
  "Great things never come from comfort zones.",
  "Every event is an opportunity to grow and connect.",
];

export default function EventDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [upcoming, setUpcoming] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [cancelled, setCancelled] = useState<number>(0);
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const index = Math.floor(Math.random() * eventQuotes.length);
    setQuote(eventQuotes[index]);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.events) {
          setEvents(data.events);
          setUpcoming(data.events.filter((e: Event) => e.status === "upcoming").length);
          setCompleted(data.events.filter((e: Event) => e.status === "completed").length);
          setCancelled(data.events.filter((e: Event) => e.status === "cancelled").length);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <section className="text-center max-w-2xl mx-auto space-y-6 mb-2">
            <h1 className="text-4xl md:text-5xl  text-indigo-600 dark:text-indigo-400 font-extrabold">
              <Link href="/">📅 MyBudgetory</Link>
            </h1>
          </section>

          {/* Quote of the Day */}
          <section className="text-center rounded-xl p-6 shadow-lg mb-2">
            <p className="text-gray-400 italic">“{quote}”</p>
          </section>

          {/* Welcome & Stats */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileDigit />
                <h1 className="text-4xl font-extrabold tracking-tight">Event Dashboard</h1>
              </div>
              <p className="text-gray-400 mt-1">
                Welcome back 👋, {user?.email || "User"}
              </p>
            </div>
            <div className="mb-12">
            </div>
            
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 p-6 rounded-lg shadow">
              <CalendarClock className="text-indigo-400 mb-2" />
              <p className="text-lg">Upcoming Events</p>
              <p className="text-2xl font-bold text-green-400">
                {loading ? "Loading..." : upcoming}
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg shadow">
              <CalendarCheck className="text-indigo-400 mb-2" />
              <p className="text-lg">Completed Events</p>
              <p className="text-2xl font-bold text-gray-300">
                {loading ? "Loading..." : completed}
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg shadow">
              <CalendarX className="text-indigo-400 mb-2" />
              <p className="text-lg">Cancelled Events</p>
              <p className="text-2xl font-bold text-red-400">
                {loading ? "Loading..." : cancelled}
              </p>
            </div>
          </div>

          {/* Event List */}
          <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
            {loading ? (
              <p className="text-gray-400 animate-pulse">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-400">No events yet.</p>
            ) : (
              <ul className="space-y-3">
                {[...events].slice(0, 10).map((event) => (
                  <li key={event._id} className="flex justify-between items-center p-3 bg-white/5 rounded-md">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(event.date).toLocaleDateString()} • {event.location}
                      </p>
                      <p className="text-sm text-gray-400">{event.description}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        event.status === "upcoming"
                          ? "text-green-400"
                          : event.status === "completed"
                          ? "text-gray-400"
                          : "text-red-400"
                      }`}
                    >
                      {event.status.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    
  );
}
