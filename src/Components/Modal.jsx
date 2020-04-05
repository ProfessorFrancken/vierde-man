import React from 'react';
import classNames from 'classnames';

const Modal = ({ className, ...props }) => {
  return <div {...props} className={classNames(className)}></div>;
};
const Dialog = ({ children, className, ...props }) => {
  const componentClasses = [
    'd-flex',
    'flex-column',
    // 'w-50',
    'text-left',
    'bg-white',
    'shadow',
    'border'
  ];

  return (
    <div
      {...props}
      style={{ zIndex: 'var(--modal-z-index)' }}
      className={classNames(componentClasses, className)}
    >
      {children}
    </div>
  );
};
const Header = ({ children, className, ...props }) => {
  const componentClasses = ['p-3 border-bottom'];
  return (
    <div {...props} className={classNames(componentClasses, className)}>
      {children}
    </div>
  );
};
const Title = ({ children, className, ...props }) => {
  const componentClasses = ['h5'];
  return (
    <h3 {...props} className={classNames(componentClasses, className)}>
      {children}
    </h3>
  );
};
const Body = ({ children, className, ...props }) => {
  const componentClasses = ['p-3'];
  return (
    <div {...props} className={classNames(componentClasses, className)}>
      {children}
    </div>
  );
};
const Table = ({ className, ...props }) => {
  return <div {...props} className={classNames(className)}></div>;
};

const Footer = ({ children, className, ...props }) => {
  const componentClasses = ['bg-light', 'text-muted', 'border-top'];
  return (
    <div {...props} className={classNames(componentClasses, className)}>
      {children}
    </div>
  );
};
const Actions = ({ children, className, ...props }) => {
  const componentClasses = ['d-flex', 'justify-content-between'];
  return (
    <div className="bg-white">
      <div {...props} className={classNames(componentClasses, className)}>
        {children}
      </div>
    </div>
  );
};
const Action = ({
  children,
  onClick,
  type = 'submit',
  className,
  ...props
}) => {
  const componentClasses = [
    'm-0',
    'btn',
    'btn-sm',
    'btn-text',
    'text-primary',
    'btn-block',
    'bg-light',
    'p-3',
    'px-3'
  ];
  return (
    <button
      onClick={onClick}
      type={type}
      {...props}
      className={classNames(componentClasses, className)}
    >
      {children}
    </button>
  );
};

Modal.Dialog = Dialog;
Modal.Header = Header;
Modal.Title = Title;
Modal.Body = Body;
Modal.Table = Table;
Modal.Footer = Footer;
Modal.Actions = Actions;
Modal.Action = Action;

export default Modal;
