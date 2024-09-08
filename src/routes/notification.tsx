import React, { useState, useEffect } from "react";
import { BellRing } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import moment from "moment";
import { useAuth } from "@/context/AuthContext"; // Adjust path as necessary

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const { role } = useAuth(); // Get the user role from the context

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/notifications/");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const now = new Date().toISOString();

      if (editMode && currentNotification) {
        const updatedNotification = {
          ...currentNotification,
          title,
          message,
          createdAt: now,
        };
        const response = await axios.put(
          `http://localhost:3000/notifications/save/${currentNotification._id}`,
          updatedNotification
        );

        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n._id === currentNotification._id ? response.data : n
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:3000/notifications/add",
          {
            title,
            message,
            createdAt: now,
          }
        );
        const newNotification: Notification = response.data;
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
      }

      setTitle("");
      setMessage("");
      setShowForm(false);
      setEditMode(false);
      setCurrentNotification(null);
    } catch (error) {
      console.error("Error creating/updating notification:", error);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:3000/notifications/delete/${_id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n._id !== _id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleEdit = (notification: Notification) => {
    setTitle(notification.title);
    setMessage(notification.message);
    setCurrentNotification(notification);
    setShowForm(true);
    setEditMode(true);
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="relative m-5 p-5 shadow-lg rounded-lg w-1/2">
        <h2 className="text-2xl text-center font-bold flex items-center">
          Notification <BellRing className="ml-5" />
        </h2>

        {/* Show create button only for the owner */}
        {role === "owner" && (
          <Button
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              setTitle("");
              setMessage("");
            }}
            className="absolute top-5 right-5"
          >
            + Create New Notification
          </Button>
        )}

        <div className="mt-10">
          <div className="flex flex-col gap-4">
            {Array.isArray(notifications) &&
              notifications.map((notification) => (
                <Card
                  key={notification._id}
                  className="w-full max-w-[900px] h-auto"
                >
                  <CardHeader>
                    <CardTitle>{notification.title}</CardTitle>
                    <CardDescription>
                      {moment(notification.createdAt).fromNow()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{notification.message}</p>
                  </CardContent>
                  <CardFooter className="py-2 space-x-5">
                    {/* Show edit and delete buttons only for the owner */}
                    {role === "owner" && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(notification)}
                        >
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(notification._id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>

        {/* Create & Edit Form */}
        {showForm && (
          <Card className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
            <div className="bg-white p-6 rounded-lg w-[800px] max-w-[90%]">
              <h2 className="text-lg font-semibold">
                {editMode ? "Edit Notification" : "Create Notification"}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid w-full items-center gap-4"
              >
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    placeholder="Title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    placeholder="Enter the Message..."
                    id="message"
                    className="flex h-32 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm  disabled:opacity-50"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="bg-violet-900 text-white">
                  {editMode ? "Update" : "Publish"}
                </Button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Notification;
