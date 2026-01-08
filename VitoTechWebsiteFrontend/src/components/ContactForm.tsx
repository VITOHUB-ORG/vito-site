// src/components/ContactForm.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { createNotification } from "../lib/notifications";
import { SERVICES } from "../lib/constants";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFileName(file ? file.name : "No file chosen");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await createNotification({
        name: fullName,
        email: businessEmail,
        phone,
        company,
        service,
        message,
        attachment: selectedFile || undefined,
      });

      setSuccess(
        "Thank you for reaching out. We've received your message and our team will contact you soon."
      );

      // Clear all fields
      setFullName("");
      setBusinessEmail("");
      setCompany("");
      setService("");
      setPhone("");
      setMessage("");
      setSelectedFile(null);
      setFileName("No file chosen");
    } catch (err) {
      console.error("ContactForm error:", err);
      setError(
        "We couldn't send your message right now. Please check that the system is online and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacts" className="bg-white py-16 pb-20 text-left">
      <div className="mx-auto max-w-6xl px-4">
        {/* Title + description */}
        <article className="border-b border-gray-200 pb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <div>
              <h3 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                Let's Talk About Your Project
              </h3>
            </div>
            <span className="hidden h-7 w-px bg-gray-300 md:inline-block" />
            <div>
              <p className="max-w-2xl text-sm text-gray-600 md:text-base">
                We'd love to learn about your goals. Fill in a few details and
                our team will reach out soon.
              </p>
            </div>
          </div>
        </article>

        {/* Form */}
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
              >
                Your Full Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border-0 bg-[#f6f6f6] px-4 py-4 text-sm text-gray-900 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-[#6f7dfa]"
              />
            </div>

            {/* Business Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
              >
                Your Business Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                required
                className="w-full border-0 bg-[#f6f6f6] px-4 py-4 text-sm text-gray-900 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-[#6f7dfa]"
              />
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="contact-company"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
              >
                Company
              </label>
              <input
                id="contact-company"
                name="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border-0 bg-[#f6f6f6] px-4 py-4 text-sm text-gray-900 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-[#6f7dfa]"
              />
            </div>

            {/* Service */}
            <div>
              <label
                htmlFor="contact-service"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
              >
                Service Interested In
              </label>
              <select
                id="contact-service"
                name="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full border-0 bg-[#f6f6f6] px-4 py-3.5 text-sm text-gray-900 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-[#6f7dfa]"
              >
                <option value="">Select Service</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone with country flags */}
            <div className="md:col-span-2">
              <label
                htmlFor="contact-phone"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
              >
                Phone (with country code)
              </label>
              <div className="w-full bg-[#f6f6f6] px-2 py-1">
                <PhoneInput
                  defaultCountry="tz"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  className="w-full pt-2"
                  inputClassName="!w-full !h-12 !border-0 !bg-[#f6f6f6] !text-sm !text-gray-900 !outline-none !ring-0"
                  inputProps={{
                    name: "phone",
                    id: "contact-phone",
                    required: true,
                  }}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact-message"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Tell us more about your idea, timeline, or any special requests..."
              className="w-full resize-none border-0 bg-[#f6f6f6] px-4 py-4 text-sm text-gray-900 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-[#6f7dfa]"
            />
          </div>

          {/* File upload */}
          <div className="mt-4">
            <p className="mb-2 pl-1 text-sm font-semibold text-gray-800">
              Attach Proposal or File (optional)
            </p>

            <div className="flex items-center gap-0 overflow-hidden border border-gray-200 bg-gray-50">
              <label
                htmlFor="contact-file"
                className="flex h-11 cursor-pointer items-center px-4 text-sm font-medium text-white"
                style={{ backgroundColor: "#007bff" }}
              >
                Choose File
              </label>
              <input
                id="contact-file"
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
              Allowed formats: PDF, DOCX, PPTX, ZIP, JPG, PNG (max 5MB).
            </p>
          </div>

          {/* Status messages */}
          {success && (
            <p className="text-sm font-medium text-emerald-600">{success}</p>
          )}
          {error && (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex items-center justify-center bg-[#6f7dfa] px-10 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-[#5a6aec] focus:outline-none focus:ring-2 focus:ring-[#6f7dfa] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}