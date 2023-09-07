interface ModalWindow extends React.PropsWithChildren {
  isOpen: boolean;
}

export const ModalWindow = ({ isOpen, children }: ModalWindow) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">{children}</div>
    </div>
  );
};
