import React from "react";
import BaseUser from "../Base/BaseUser";

const Contact = () => {
  return (
    <BaseUser>
        <h1 className="text-4xl font-bold text-green-600 mb-6">Contact Us</h1>
        <p className="text-lg text-black max-w-2xl mx-auto mb-6">
          Have questions? Need support? Reach out to us via email or phone, and we'll be happy to assist you.
        </p>
        <div className="text-lg">
          📧 <a href="mailto:support@playnation.com" className="text-green-600 hover:underline">support@playnation.com</a><br />
          📞 <a href="tel:+1234567890" className="text-green-600 hover:underline">+1 234 567 890</a>
        </div>
    </BaseUser>
  );
};

export default Contact;
