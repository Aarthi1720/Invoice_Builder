import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, User, UserCircle2 } from "lucide-react";

const BillingToForm = ({
  value = {},
  onChange,
  onExistingClick,
  readOnly = false,
}) => {
  const inputRef = useRef();
  const [logo, setLogo] = useState(value.logo || "");
  const [name, setName] = useState(value.name || "");
  const [address, setAddress] = useState(value.address || "");
  const [mobile, setMobile] = useState(value.mobile || "");
  const [email, setEmail] = useState(value.email || "");

  // Only update local state if prop changes (avoids extra renders)
  useEffect(() => {
    if (
      value.logo !== logo ||
      value.name !== name ||
      value.address !== address ||
      value.mobile !== mobile ||
      value.email !== email
    ) {
      setLogo(value.logo || "");
      setName(value.name || "");
      setAddress(value.address || "");
      setMobile(value.mobile || "");
      setEmail(value.email || "");
    }
    // eslint-disable-next-line
  }, [value]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target.result);
        onChange?.({ logo: ev.target.result, name, address, mobile, email });
      };
      reader.readAsDataURL(file);
    }
  };

  // Update parent on field changes
  const emitChange = (newFields) => {
    const next = {
      logo,
      name,
      address,
      mobile,
      email,
      ...newFields,
    };
    setLogo(next.logo);
    setName(next.name);
    setAddress(next.address);
    setMobile(next.mobile);
    setEmail(next.email);
    onChange?.(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Top: + Existing button and label */}
      <div className="flex items-center gap-5">
        <span className="font-semibold font-Lora">Billing To</span>
        {!readOnly && (
          <button
            type="button"
            className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 text-blue-500 font-semibold flex justify-center items-center"
            onClick={onExistingClick}
          >
            <User className="w-5 h-5 text-blue-500" />+ Existing
          </button>
        )}
      </div>
      {/* Logo row */}
      <div className="flex items-center gap-2">
        {readOnly ? (
          logo ? (
            <img
              src={logo}
              alt="client"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <UserCircle2 className="w-10 h-10 text-gray-300" />
          )
        ) : (
          <>
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
          </>
        )}
      </div>
      {/* Fields */}
      {readOnly ? (
        <div className="flex flex-col gap-1 text-gray-700 text-[16px]">
          <div>
            <span className="font-medium">Name:</span> {name || ""}
          </div>
          <div>
            <span className="font-medium">Address:</span> {address || ""}
          </div>
          <div>
            <span className="font-medium">Mobile:</span> {mobile || ""}
          </div>
          <div>
            <span className="font-medium">Email:</span> {email || ""}
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Client Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              emitChange({ name: e.target.value });
            }}
            autoComplete="off"
          />
          <input
            type="text"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Client Address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              emitChange({ address: e.target.value });
            }}
            autoComplete="off"
          />
          <input
            type="text"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Client Mobile"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              emitChange({ mobile: e.target.value });
            }}
            autoComplete="off"
          />
          <input
            type="email"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Client Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              emitChange({ email: e.target.value });
            }}
            autoComplete="off"
          />
        </>
      )}
    </div>
  );
};

export default BillingToForm;
