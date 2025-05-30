"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, CalendarClock, FileDigit } from "lucide-react";
import axios from "axios";
import CreateEvent from "@/components/CreateEvent";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: "Complete" | "Incomplete";
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
  const [incomplete, setIncomplete] = useState<number>(0);
  const [complete, setComplete] = useState<number>(0);
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

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
    const fetchEvents = async () => {
      if (!user) return;
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const events = res.data.events;

        if (events) {
          setEvents(events);
          setComplete(
            events.filter((e: Event) => e.status === "Complete").length
          );
          setIncomplete(
            events.filter((e: Event) => e.status === "Incomplete").length
          );
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, refreshTrigger]);

  const refreshEvents = () => {
    setLoading(true);
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto space-y-6 mb-2">
          <h1 className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold">
            <Link href="/">📅 MyBudgetory</Link>
          </h1>
        </section>
        <section className="flex items-center justify-center mt-5 text-amber-600">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-center">
              "Under Developement"
            </h1>
          </div>
        </section>
      </div>
    </div>
  );
}
