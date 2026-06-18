"use client";

import React, { useState } from "react";
import { 
  Form,
  Fieldset,
  TextField,
  TextArea,
  Select,
  ListBox,
  Switch,
  Button,
  Alert
} from "@heroui/react"; 
import { 
  Briefcase, 
  CircleCheck, 
  ShieldCheck,
  Xmark
} from "@gravity-ui/icons";

export default function CreateJobForm() {
  const companyData = {
    name: "TechWave Bangladesh",
    plan: "Growth", 
    activeJobs: 4,
    limit: 10,
    isApproved: true,
  };

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobCategory: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    currency: "BDT",
    city: "",
    country: "Bangladesh",
    isRemote: false,
    deadline: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: ""
  });

  const [errors, setErrors] = useState({});
  const isLimitExceeded = companyData.activeJobs >= companyData.limit;
  const canPostJob = companyData.isApproved && !isLimitExceeded;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectionChange = (name, key) => {
    setFormData((prev) => ({ ...prev, [name]: key }));
  };

  const handleSwitchChange = (isSelected) => {
    setFormData((prev) => ({ ...prev, isRemote: isSelected }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canPostJob) return;

    const newErrors = {};
    if (!formData.jobTitle) newErrors.jobTitle = "জব টাইটেল দেওয়া আবশ্যক";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("Submitted Job Data:", formData);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-4xl bg-[#1c1c1e] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-zinc-800">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Briefcase size={20} className="text-zinc-400" /> Post a New Job
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Enter the position details to start receiving applications.</p>
          </div>
          <button type="button" className="text-zinc-500 hover:text-zinc-300 transition p-1 rounded-md hover:bg-zinc-800">
            <Xmark size={18} />
          </button>
        </div>

        {/* Plan Status Alert */}
        <div className="px-6 pt-4">
          {!companyData.isApproved ? (
            <Alert color="danger" title="Company Not Approved" className="bg-red-950/30 border-red-900/50 text-red-400" />
          ) : isLimitExceeded ? (
            <Alert color="warning" title="Job Posting Limit Reached" className="bg-amber-950/30 border-amber-900/50 text-amber-400" />
          ) : (
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs text-zinc-400">
              <ShieldCheck className="text-emerald-500" size={16} />
              <div>
                <span className="text-zinc-200 font-medium">{companyData.name}</span> ({companyData.plan} Plan) — Active Jobs: {companyData.activeJobs}/{companyData.limit}
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <Form onSubmit={onSubmit} className="p-6 space-y-8">
          
          {/* SECTION 1: Job Info */}
          <Fieldset className="w-full">
            <legend className="text-sm font-semibold tracking-wide text-zinc-400 uppercase border-b border-zinc-800 pb-2 w-full mb-4">
              1. Job Information
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {/* Job Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Job Title *</label>
                <TextField
                  required
                  name="jobTitle"
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
                {errors.jobTitle && <span className="text-xs text-red-500">{errors.jobTitle}</span>}
              </div>
              
              {/* Job Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Job Category *</label>
                <Select 
                  className="w-full" 
                  placeholder="Select category"
                  selectedKey={formData.jobCategory}
                  onSelectionChange={(key) => handleSelectionChange("jobCategory", key)}
                >
                  <Select.Trigger className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-medium p-3 hover:border-zinc-700 flex justify-between items-center text-sm w-full">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover className="bg-[#1c1c1e] border border-zinc-800 text-zinc-200">
                    <ListBox>
                      <ListBox.Item id="software" textValue="Software Engineering" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">
                        Software Engineering
                      </ListBox.Item>
                      <ListBox.Item id="design" textValue="UI/UX Design" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">
                        UI/UX Design
                      </ListBox.Item>
                      <ListBox.Item id="marketing" textValue="Marketing" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">
                        Marketing
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Job Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Job Type *</label>
                <Select 
                  className="w-full" 
                  placeholder="Select employment type"
                  selectedKey={formData.jobType}
                  onSelectionChange={(key) => handleSelectionChange("jobType", key)}
                >
                  <Select.Trigger className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-medium p-3 hover:border-zinc-700 flex justify-between items-center text-sm w-full">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover className="bg-[#1c1c1e] border border-zinc-800 text-zinc-200">
                    <ListBox>
                      <ListBox.Item id="full-time" textValue="Full-time" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">Full-time</ListBox.Item>
                      <ListBox.Item id="part-time" textValue="Part-time" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">Part-time</ListBox.Item>
                      <ListBox.Item id="remote" textValue="Remote" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">Remote</ListBox.Item>
                      <ListBox.Item id="contract" textValue="Contract" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">Contract</ListBox.Item>
                      <ListBox.Item id="internship" textValue="Internship" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">Internship</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Deadline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Application Deadline *</label>
                <TextField
                  required
                  type="date"
                  name="deadline"
                  className="w-full"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Salary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5 w-full">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Min Salary *</label>
                <TextField
                  required
                  type="number"
                  name="minSalary"
                  placeholder="Min"
                  value={formData.minSalary}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Max Salary *</label>
                <TextField
                  required
                  type="number"
                  name="maxSalary"
                  placeholder="Max"
                  value={formData.maxSalary}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Currency</label>
                <Select 
                  className="w-full" 
                  placeholder="Select Currency"
                  selectedKey={formData.currency}
                  onSelectionChange={(key) => handleSelectionChange("currency", key)}
                >
                  <Select.Trigger className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-medium p-3 hover:border-zinc-700 flex justify-between items-center text-sm w-full">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover className="bg-[#1c1c1e] border border-zinc-800 text-zinc-200">
                    <ListBox>
                      <ListBox.Item id="BDT" textValue="BDT (৳)" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">BDT (৳)</ListBox.Item>
                      <ListBox.Item id="USD" textValue="USD ($)" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">USD ($)</ListBox.Item>
                      <ListBox.Item id="EUR" textValue="EUR (€)" className="hover:bg-zinc-800 p-2 rounded cursor-pointer text-sm">EUR (€)</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>

            {/* Remote Switch */}
            <div className="mt-6 p-4 bg-[#141416] border border-zinc-800 rounded-xl space-y-4 w-full">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-zinc-200">Remote Position</span>
                  <span className="text-xs text-zinc-500">This job can be done from anywhere.</span>
                </div>
                <Switch 
                  isSelected={formData.isRemote} 
                  onValueChange={handleSwitchChange}
                  color="default"
                />
              </div>
              
              {!formData.isRemote && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-zinc-400">City *</label>
                    <TextField
                      required={!formData.isRemote}
                      name="city"
                      placeholder="e.g. Dhaka"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-zinc-400">Country *</label>
                    <TextField
                      required={!formData.isRemote}
                      name="country"
                      placeholder="e.g. Bangladesh"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </Fieldset>

          {/* SECTION 2: Description & Details */}
          <Fieldset className="w-full">
            <legend className="text-sm font-semibold tracking-wide text-zinc-400 uppercase border-b border-zinc-800 pb-2 w-full mb-4">
              2. Description & Details
            </legend>

            <div className="space-y-5 w-full">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Job Description *</label>
                <TextArea
                  required
                  name="description"
                  placeholder="Provide a general overview..."
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Responsibilities *</label>
                <TextArea
                  required
                  name="responsibilities"
                  placeholder="Outline core responsibilities..."
                  rows={4}
                  value={formData.responsibilities}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Requirements *</label>
                <TextArea
                  required
                  name="requirements"
                  placeholder="List educational backgrounds..."
                  rows={4}
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Benefits (Optional)</label>
                <TextArea
                  name="benefits"
                  placeholder="Perks, insurance, bonuses..."
                  rows={3}
                  value={formData.benefits}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Fieldset>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 w-full">
            <Button variant="flat" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-medium">
              Cancel
            </Button>
            <Button
              type="submit"
              className={`font-semibold px-6 ${canPostJob ? "bg-white text-zinc-900 hover:bg-zinc-200" : "bg-zinc-800 text-zinc-500"}`}
              disabled={!canPostJob}
              endContent={<CircleCheck size={16} />}
            >
              Publish Job Post
            </Button>
          </div>

        </Form>
      </div>
    </div>
  );
}