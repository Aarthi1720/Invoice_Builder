import React, { useRef, useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "react-toastify";

const BusinessInfoForm = ({ initial, onSubmit, clearCompany }) => {
  const [logo, setLogo] = useState(initial?.logo || "");
  const [name, setName] = useState(initial?.name || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const inputRef = useRef();

  // Sync with parent updates to `initial`
  useEffect(() => {
    setLogo(initial?.logo || "");
    setName(initial?.name || "");
    setAddress(initial?.address || "");
    setEmail(initial?.email || "");
    setPhone(initial?.phone || "");
  }, [initial]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target.result);
        onChange?.({
          ...value,
          logo: ev.target.result,
          name,
          address,
          mobile,
          email,
        });
      };
      reader.readAsDataURL(file);
    }
    // Allow selecting the same file again if needed
    e.target.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !email || !phone) {
      toast.error("All fields are required⚠️");
      return;
    }
    if (onSubmit) {
      onSubmit({ logo, name, address, email, phone });
      toast.success("Business info saved👍");
    }
    // Optional: Show feedback
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      {/* Logo Upload */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="relative w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center bg-gray-50 hover:bg-blue-50 border-blue-300"
        >
          {logo ? (
            <img
              src={logo}
              alt="logo"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <UploadCloud className="w-6 h-6 text-blue-400" />
          )}
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleLogoChange}
        />
        <span className="text-xs text-gray-500">Logo</span>
      </div>

      <input
        type="text"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Company Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
      />

      <input
        type="text"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        autoComplete="off"
      />

      <input
        type="email"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="off"
      />

      <input
        type="text"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="off"
      />

      <button
        type="submit"
        className="mt-2 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-semibold rounded-xl py-2 transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
      >
        Save
      </button>
      <button
        type="button"
        className="bg-gradient-to-br from-[#e27d7d] to-[#e41111] text-white rounded-xl py-2 mt-2 hover:bg-gradient-to-tl transition hover:cursor-pointer hover:from-[#e27d7d] hover:to-[#e41111] duration-500 active:scale-90"
        onClick={clearCompany}
      >
        Clear Business Info
      </button>
    </form>
  );
};

export default BusinessInfoForm;
