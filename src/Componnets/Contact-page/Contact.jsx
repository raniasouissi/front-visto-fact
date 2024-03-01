// Contact.jsx
import React from "react";
import { useForm } from "react-hook-form";
import "./Contact.css";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <section className="contact-section">
      <div className="spacer" />
      <div className="contact-container">
        <h2>Contactez-nous</h2>
        <p>
          Pour toute question ou préoccupation, n&apos;hésitez pas à nous
          contacter. Remplissez le formulaire ci-dessous, et nous vous
          répondrons dans les plus brefs délais.
        </p>
        <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Nom</label>
            <input
              {...register("name", { required: "Ce champ est requis" })}
              className={`form-input ${errors.name ? "invalid" : ""}`}
            />
            {errors.name && (
              <p className="error-message error-message-text">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              {...register("email", {
                required: "Ce champ est requis",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Adresse email invalide",
                },
              })}
              className={`form-input ${errors.email ? "invalid" : ""}`}
            />
            {errors.email && (
              <p className="error-message error-message-text">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              {...register("message", { required: "Ce champ est requis" })}
              className={`form-textarea ${errors.message ? "invalid" : ""}`}
            />
            {errors.message && (
              <p className="error-message error-message-text">
                {errors.message.message}
              </p>
            )}
          </div>
          <button type="submit" className="submit-button">
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
