import React, { useState, useEffect, useRef } from "react";
import { UploadCloud } from "lucide-react";

const EditClientModal = ({ open, onClose, client, onSave }) => {
  const inputRef = useRef();
  const [logo, setLogo] = useState(client?.logo || "");
  const [name, setName] = useState(client?.name || "");
  const [address, setAddress] = useState(client?.address || "");
  const [mobile, setMobile] = useState(client?.mobile || "");
  const [email, setEmail] = useState(client?.email || "");

  useEffect(() => {
    setLogo(client?.logo || "");
    setName(client?.name || "");
    setAddress(client?.address || "");
    setMobile(client?.mobile || "");
    setEmail(client?.email || "");
  }, [client]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !mobile || !email) return;
    onSave(client.id, { logo, name, address, mobile, email });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-2">
        <h2 className="text-2xl font-bold text-blue-900 flex-1 mb-4">
          Edit Client
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="relative w-12 h-12 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center bg-gray-50 hover:bg-blue-50"
            >
              {logo ? (
                <img
                  src={logo}
                  alt="client"
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
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Client Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            type="text"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Client Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
          <input
            type="email"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Client Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="flex-1 bg-gray-200 rounded-xl py-2 hover:cursor-pointer font-medium hover:bg-gray-400 transition duration-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-medium rounded-xl py-2 transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
