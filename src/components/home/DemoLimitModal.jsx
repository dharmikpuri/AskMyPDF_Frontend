import Modal from "../Modal";

export default function DemoLimitModal({ onSignup, onLogin, onClose }) {
  return (
    <Modal
      title="You've used your free questions"
      onClose={onClose}
      actions={
        <>
          <button type="button" className="btn btn-primary" onClick={onSignup} data-autofocus>
            Create free account
          </button>
          <button type="button" className="btn btn-secondary" onClick={onLogin}>
            Log in
          </button>
          <button type="button" className="btn btn-text" onClick={onClose}>
            Maybe later
          </button>
        </>
      }
    >
      Create a free account to keep chatting, upload your own PDFs and keep your history &mdash; it takes 30
      seconds.
    </Modal>
  );
}
