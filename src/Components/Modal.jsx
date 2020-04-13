import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

const StyledDialog = styled.div`
  @media (min-width: 250px) {
    min-width: 200px;
  }
  @media (min-width: 400px) {
    min-width: 350px;
  }
`;

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
  ];

  return (
    <StyledDialog
      {...props}
      style={{ zIndex: 'var(--modal-z-index)' }}
      className={classNames(componentClasses, className)}
    >
      {children}
    </StyledDialog>
  );
};
const Header = ({ children, className, ...props }) => {
  const componentClasses = [
    'p-3',
    'border-bottom',
    'border-left',
    'border-right',
  ];
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
  const componentClasses = ['p-3', 'border-left', 'border-right'];
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
  const componentClasses = [
    'bg-light',
    'text-muted',
    'border-top',
    'border-left',
    'border-right',
    'border-bottom',
  ];
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
  primary = false,
  ...props
}) => {
  const componentClasses = [
    'm-0',
    'btn',
    'btn-sm',
    'btn-text',
    'btn-block',
    'p-3',
    'px-3',
    'rounded-0',
    ...(primary ? ['text-white', 'bg-primary'] : ['text-primary', 'bg-light']),
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
