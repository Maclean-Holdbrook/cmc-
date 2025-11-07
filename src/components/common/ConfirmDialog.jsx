import Modal from './Modal';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small" showCloseButton={false}>
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`btn btn-${type}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
