// @flow strict
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from './Box.js';
import Heading from './Heading.js';
import StopScrollBehavior from './behaviors/StopScrollBehavior.js';
import TrapFocusBehavior from './behaviors/TrapFocusBehavior.js';
import styles from './Modal.css';

type Props = {|
  accessibilityModalLabel: string,
  children?: React.Node,
  closeOnOutsideClick?: boolean,
  footer?: React.Node,
  heading?: string | React.Node,
  onDismiss: () => void,
  role?: 'alertdialog' | 'dialog',
  size?: 'sm' | 'md' | 'lg' | number,
|};

const SIZE_WIDTH_MAP = {
  sm: 540,
  md: 720,
  lg: 900,
};

const ESCAPE_KEY_CODE = 27;

function Backdrop({
  children,
  onClick,
}: {
  children?: React.Node,
  onClick?: (event: MouseEvent) => void,
}) {
  const handleClick = event => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (onClick) {
      onClick(event);
    }
  };
  return (
    <>
      {/* Disabling the linters below is fine, we don't want key event listeners (ESC handled elsewhere) */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={styles.backdrop} onClick={handleClick} />
      {children}
    </>
  );
}

function Header({ heading }: {| heading: string | React.Node |}) {
  if (typeof heading !== 'string') {
    return heading;
  }

  return (
    <Box display="flex" justifyContent="center" padding={8}>
      <Heading size="md" accessibilityLevel={1}>
        {heading}
      </Heading>
    </Box>
  );
}

export default function Modal({
  accessibilityModalLabel,
  children,
  closeOnOutsideClick = true,
  onDismiss,
  footer,
  heading,
  role = 'dialog',
  size = 'sm',
}: Props) {
  React.useEffect(() => {
    function handleKeyUp(event: { keyCode: number }) {
      if (event.keyCode === ESCAPE_KEY_CODE) {
        onDismiss();
      }
    }

    window.addEventListener('keyup', handleKeyUp);
    return function cleanup() {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onDismiss]);

  const handleOutsideClick = () => {
    if (closeOnOutsideClick) {
      onDismiss();
    }
  };

  const width = typeof size === 'string' ? SIZE_WIDTH_MAP[size] : size;

  return (
    <StopScrollBehavior>
      <TrapFocusBehavior>
        <div
          aria-label={accessibilityModalLabel}
          className={styles.container}
          role={role}
        >
          <Backdrop onClick={handleOutsideClick}>
            <div className={styles.wrapper} tabIndex={-1} style={{ width }}>
              <Box
                flex="grow"
                position="relative"
                display="flex"
                direction="column"
                width="100%"
              >
                {heading && (
                  <Box fit>
                    <Header heading={heading} />
                  </Box>
                )}
                <div className={styles.content}>{children}</div>
                {footer && (
                  <Box fit>
                    <Box>
                      <Box padding={8}>{footer}</Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </div>
          </Backdrop>
        </div>
      </TrapFocusBehavior>
    </StopScrollBehavior>
  );
}

Modal.propTypes = {
  accessibilityModalLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  closeOnOutsideClick: PropTypes.bool,
  footer: PropTypes.node,
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onDismiss: PropTypes.func,
  role: PropTypes.oneOf(['alertdialog', 'dialog']),
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['sm', 'md', 'lg']),
  ]),
};
