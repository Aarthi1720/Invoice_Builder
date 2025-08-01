import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "react-toastify";

const ClientForm = ({ onSubmit }) => {
  const [logo, setLogo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const inputRef = useRef();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !mobile || !email) {
      toast.error("All fields are required⚠️");
      return;
    }
    if (onSubmit) {
      onSubmit({ logo, name, address, mobile, email });
    }
    setLogo("");
    setName("");
    setAddress("");
    setMobile("");
    setEmail("");
    toast.success("Client Saved👍");
  };

  return (
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
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Client Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
      />
      <input
        type="text"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Client Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        autoComplete="off"
      />
      <input
        type="text"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Client Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        autoComplete="off"
      />
      <input
        type="email"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Client Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="off"
      />
      <button
        type="submit"
        className="mt-2 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-medium rounded-xl py-2 transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
      >
        Save
      </button>
    </form>
  );
};

export default ClientForm;
