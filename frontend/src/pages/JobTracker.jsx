import { useEffect, useMemo, useState } from "react";
import JobCard, { sortJobsForAppliedBox } from "../components/JobCard";
import AddJobModal from "../components/AddJobModal";
import axios from "axios";

/* ---------- helpers ---------- */

function yyyyMmDdToday() {
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function StatCard({ title, value, accent }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className={`px-4 py-2 text-white font-semibold ${accent}`}>{title}</div>
      <div className="p-4">
        <div className="text-4xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function Panel({ title, children, rightSlot }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <div className="text-lg font-semibold">{title}</div>
        {rightSlot}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ---------- Edit Modal (Tailwind-styled) ---------- */

function EditJobModal({ open, job, onClose, onSave }) {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [dateApplied, setDateApplied] = useState(yyyyMmDdToday());
  const [status, setStatus] = useState("Not Applied");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open || !job) return;
    setPosition(job.positionTitle ?? "");
    setCompany(job.companyName ?? "");
    setLocation(job.location ?? "");
    setDateApplied(job.dateapplied || yyyyMmDdToday());
    setStatus(job.status ?? "Not Applied");
    setNotes(job.notes ?? "");
  }, [open, job]);

  if (!open || !job) return null;

  const input =
    "w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:border-black";

  return (
    <div
      onMouseDown={onClose}
      className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center p-4"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-white border shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div className="text-3xl font-extrabold">Edit Job</div>
          <button
            onClick={onClose}
            className="text-3xl leading-none px-2 rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="text-lg font-bold mb-2">Position *</div>
            <input
              className={input}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., SWE Intern"
            />
          </div>

          <div>
            <div className="text-lg font-bold mb-2">Company *</div>
            <input
              className={input}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google"
            />
          </div>

          <div>
            <div className="text-lg font-bold mb-2">Location</div>
            <input
              className={input}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Toronto / Remote"
            />
          </div>

          <div>
            <div className="text-lg font-bold mb-2">Date Applied</div>
            <input
              type="date"
              className={input}
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
            />
          </div>

          <div>
            <div className="text-lg font-bold mb-2">Status</div>
            <select className={input} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Not Applied</option>
              <option>APPLIED</option>
              <option>INTERVIEW</option>
              <option>OFFER</option>
              <option>ACCEPTED</option>
              <option>REJECTED</option>
            </select>
          </div>

          <div>
            <div className="text-lg font-bold mb-2">Notes</div>
            <textarea
              className={`${input} min-h-[140px] resize-y`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything important..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="rounded-xl border-2 border-gray-200 bg-white px-5 py-3 font-bold hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                if (!position.trim() || !company.trim()) return;
                onSave({
                  ...job,
                  jobid: job.id,
                  positionTitle: position.trim(),
                  companyName: company.trim(),
                  location: location.trim(),
                  dateapplied: dateApplied || yyyyMmDdToday(),
                  status,
                  notes,
                });
              }}
              className="rounded-xl bg-black text-white px-5 py-3 font-extrabold hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- main page ---------- */

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Your existing groups (kept)
  const offeredJobs = useMemo(() => jobs.filter((j) => j.status === "OFFER"), [jobs]);
  const notAppliedJobs = useMemo(() => jobs.filter((j) => j.status === "NOT_APPLIED"), [jobs]);

  const appliedJobs = useMemo(() => {
    const group = jobs.filter((j) => j.status !== "NOT_APPLIED" && j.status !== "OFFER");
    return sortJobsForAppliedBox(group);
  }, [jobs]);

  // Stats for cards
  const stats = useMemo(() => {
    const applied = jobs.filter((j) => j.status === "APPLIED").length;
    const interviews = jobs.filter((j) => j.status === "INTERVIEW").length;
    const offers = jobs.filter((j) => j.status === "OFFER" || j.status === "ACCEPTED").length;
    const rejected = jobs.filter((j) => j.status === "REJECTED").length;
    return { applied, interviews, offers, rejected };
  }, [jobs]);

  // “Notifications” (generated from current jobs for now)
  const notifications = useMemo(() => {
    // simple: show most “important” jobs at top
    const priority = { OFFER: 1, ACCEPTED: 2, INTERVIEW: 3, REJECTED: 4, APPLIED: 5 };
    return [...jobs]
      .filter((j) => ["OFFER", "ACCEPTED", "INTERVIEW", "REJECTED"].includes(j.status))
      .sort((a, b) => (priority[a.status] ?? 99) - (priority[b.status] ?? 99))
      .slice(0, 5)
      .map((j) => ({
        id: j.id,
        company: j.companyName || "Company",
        message:
          j.status === "OFFER"
            ? "You received an offer."
            : j.status === "ACCEPTED"
            ? "Offer accepted."
            : j.status === "INTERVIEW"
            ? "Interview stage."
            : "Rejected.",
        type:
          j.status === "OFFER" || j.status === "ACCEPTED"
            ? "success"
            : j.status === "INTERVIEW"
            ? "info"
            : "danger",
      }));
  }, [jobs]);

  useEffect(() => {
    (async () => {
      const existingId = localStorage.getItem("key");
      const ensureRes = await axios.post("http://localhost:3000/api/key", { id: existingId });

      const userId = ensureRes.data.id;
      localStorage.setItem("key", userId);

      const jobsRes = await axios.get("http://localhost:3000/api/jobs", {
        headers: { "user-id": localStorage.getItem("key") },
      });

      setJobs(jobsRes.data.data[0].jobs);
    })();
  }, []);

  function onChangeStatus(id, newStatus) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j)));
  }

  function onAddJob(newJob) {
    setJobs((prev) => [newJob, ...prev]);
  }

  function openEdit(job) {
    setEditingJob(job);
    setIsEditOpen(true);
  }

  async function onSaveEdit(updatedJob) {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    setIsEditOpen(false);
    setEditingJob(null);

    try {
      await axios.patch("http://localhost:3000/api/jobs", updatedJob, {
        headers: { "user-id": localStorage.getItem("key") },
      });

      const jobsRes = await axios.get("http://localhost:3000/api/jobs", {
        headers: { "user-id": localStorage.getItem("key") },
      });

      setJobs(jobsRes.data.data[0].jobs);
    } catch (err) {
      console.log(err);
      alert("update failed");
    }
  }

  async function onDeleteJob(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    await axios.delete("http://localhost:3000/api/jobs", {
      headers: { "user-id": localStorage.getItem("key") },
      data: { id },
    });
  }

  return (
    <div className="space-y-8">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold">Job Tracker</h1>
          <p className="text-gray-600 mt-2">
            Offered jobs, not applied yet, and applied jobs (interviews on top, rejections at bottom).
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="rounded-xl border-2 border-blue-600 bg-white px-5 py-2 font-bold text-blue-600 hover:bg-blue-50"
        >
          + Add Job
        </button>
      </div>

      {/* Main layout: left content + right sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Applied" value={stats.applied} accent="bg-blue-500" />
            <StatCard title="Interviews" value={stats.interviews} accent="bg-amber-500" />
            <StatCard title="Offers" value={stats.offers} accent="bg-emerald-500" />
            <StatCard title="Rejected" value={stats.rejected} accent="bg-rose-500" />
          </div>

          {/* Sections */}
          <Panel title="Offered Jobs">
            {offeredJobs.length === 0 ? (
              <div className="text-gray-500">No offers yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {offeredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onChangeStatus={onChangeStatus}
                    onEdit={openEdit}
                    onDelete={onDeleteJob}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Not Applied Yet">
            {notAppliedJobs.length === 0 ? (
              <div className="text-gray-500">No jobs in “Not Applied”.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {notAppliedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onChangeStatus={onChangeStatus}
                    onEdit={openEdit}
                    onDelete={onDeleteJob}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Applied Jobs">
            {appliedJobs.length === 0 ? (
              <div className="text-gray-500">No applied jobs yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {appliedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onChangeStatus={onChangeStatus}
                    onEdit={openEdit}
                    onDelete={onDeleteJob}
                  />
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <Panel
            title="Notifications"
            rightSlot={
              notifications.length > 0 ? (
                <span className="text-xs bg-red-500 text-white rounded-full px-2 py-1">
                  {notifications.length}
                </span>
              ) : null
            }
          >
            {notifications.length === 0 ? (
              <div className="text-gray-500">No notifications yet.</div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-3">
                    <div
                      className={[
                        "h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold",
                        n.type === "success"
                          ? "bg-emerald-500"
                          : n.type === "info"
                          ? "bg-amber-500"
                          : "bg-rose-500",
                      ].join(" ")}
                    >
                      {n.company?.[0] ?? "!"}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{n.company}</div>
                      <div className="text-sm text-gray-600">{n.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Quick Actions">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsAddOpen(true)}
                className="rounded-xl bg-black text-white px-4 py-2 font-bold hover:opacity-90"
              >
                Add Application
              </button>
              <button className="rounded-xl border px-4 py-2 font-bold hover:bg-gray-50">
                Add Reminder (later)
              </button>
            </div>
          </Panel>
        </div>
      </div>

      <AddJobModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={onAddJob} setJobs={setJobs} />

      <EditJobModal
        open={isEditOpen}
        job={editingJob}
        onClose={() => {
          setIsEditOpen(false);
          setEditingJob(null);
        }}
        onSave={onSaveEdit}
      />
    </div>
  );
}
