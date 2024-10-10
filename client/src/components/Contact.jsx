import React, { useState } from "react";
import "../styles/Contact.css";
import { useRef } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();

  const [done, setDone] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_h4f9dl7",
        "template_h4cmjne",
        form.current,
        "YmbgAu2M_3T47URsF"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setDone(true);
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  return (
    <div className="mx-auto pt-5" id="contact">
      <span>Get in Touch</span>
      <form ref={form} onSubmit={sendEmail}>
        <div class="mb-3 form-input">
          <label for="exampleFormControlInput1" class="form-label">
            Name
          </label>
          <input
            class="form-control"
            type="text"
            aria-label="default input example"
            required
          />
        </div>
        <div class="mb-3 form-input">
          <label for="exampleFormControlInput1" class="form-label">
            Email
          </label>
          <input type="email" class="form-control" id="email" required />
        </div>
        <div class="mb-3 form-input">
          <label for="exampleFormControlTextarea1" class="form-label">
            Message
          </label>
          <textarea class="form-control" id="message" rows="3"></textarea>
        </div>
        <input type="submit" value="Send" className="button" />
        <span>{done && "Thanks for contacting me!"}</span>
      </form>
    </div>
  );
};

export default Contact;
