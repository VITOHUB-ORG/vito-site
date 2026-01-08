// src/components/ContactUs.tsx
import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { createNotification } from "../lib/notifications";
import { SERVICES } from "../lib/constants";

type ContactUsProps = {
  open: boolean;
  onClose: () => void;
};

export default function ContactUs({ open, onClose }: ContactUsProps) {
  const [fullName, setFullName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Attachment states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFileName(file ? file.name : "No file chosen");
  };

  // Clear form when modal opens
  useEffect(() => {
    if (open) {
      setSuccess(null);
      setError(null);
      setFullName("");
      setBusinessEmail("");
      setCompany("");
      setService("");
      setPhone("");
      setMessage("");
      // Clear file state pia
      setSelectedFile(null);
      setFileName("No file chosen");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const composedMessage = [
        message.trim(),
        "",
        "--- Extra contact details ---",
        `Company: ${company || "N/A"}`,
        `Service interested in: ${service || "N/A"}`,
        selectedFile ? `Attachment (frontend only): ${selectedFile.name}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      await createNotification({
        name: fullName,
        email: businessEmail,
        phone,
        message: composedMessage,
      });

      setSuccess(
        "Thank you for contacting us. We've received your message and will get back to you shortly."
      );

      // Clear all fields including file
      setFullName("");
      setBusinessEmail("");
      setCompany("");
      setService("");
      setPhone("");
      setMessage("");
      setSelectedFile(null);
      setFileName("No file chosen");
    } catch (err) {
      console.error("ContactUs modal error:", err);
      setError(
        "We couldn't send your message right now. Please check that the system is online and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl rounded-md bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h4 className="text-lg font-semibold text-gray-900">Contact Us</h4>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
                  htmlFor="modal-full-name"
                >
                  Your Full Name
                </label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  id="modal-full-name"
                  type="text"
                  name="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
                  htmlFor="modal-email"
                >
                  Your Business Email
                </label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  id="modal-email"
                  type="email"
                  name="email"
                  required
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
                  htmlFor="modal-company"
                >
                  Company
                </label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  id="modal-company"
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
                  htmlFor="modal-service"
                >
                  Service Interested In
                </label>
                <select
                  id="modal-service"
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select Service</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
              >
                Phone
              </label>
              <div className="rounded-md bg-gray-50 px-2 py-1">
                <PhoneInput
                  defaultCountry="tz"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  className="w-full"
                  inputClassName="!w-full !h-11 !border-0 !bg-gray-50 !text-sm !text-gray-900 !outline-none !ring-0"
                  inputProps={{
                    name: "phone",
                  }}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
                htmlFor="modal-message"
              >
                Message
              </label>
              <textarea
                className="w-full min-h-[140px] resize-y border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                id="modal-message"
                name="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* File upload section - SEHEMU MPYA IMEONGEEZWA HAPA */}
            <div className="mt-4">
              <p className="mb-2 pl-1 text-sm font-semibold text-gray-800">
                Attach Proposal or File (optional)
              </p>

              <div className="flex items-center gap-0 overflow-hidden border border-gray-200 bg-gray-50">
                <label
                  htmlFor="modal-file"
                  className="flex h-11 cursor-pointer items-center px-4 text-sm font-medium text-white"
                  style={{ backgroundColor: "#007bff" }}
                >
                  Choose File
                </label>
                <input
                  id="modal-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.png,.jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="flex-1 truncate px-3 text-sm italic text-gray-600">
                  {fileName}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Allowed formats: PDF, DOCX, PPTX, ZIP, JPG, PNG (max 5MB).{" "}
              </p>
            </div>

            {success && (
              <p className="text-sm font-medium text-emerald-600">
                {success}
              </p>
            )}
            {error && (
              <p className="text-sm font-medium text-rose-600">
                {error}
              </p>
            )}

            <button
              className="mt-2 inline-flex items-center justify-center bg-indigo-500 px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
