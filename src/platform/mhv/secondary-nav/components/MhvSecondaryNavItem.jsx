import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * A secondary nav item.
 * @param iconClass the classname(s) for a font awesome icon
 * @param href the link for the navigation item
 * @param title the title for the navigation item
 * @param abbreviation the abbreviation for the navigation item shown instead of the title when the width is less than 400px
 * @param isActive true if the nav item is to be shown as active
 * @returns a secondary nav item
 */
const MhvSecondaryNavItem = ({
  iconClass,
  href,
  title,
  abbreviation,
  isActive = false,
  isHeader = false,
}) => {
  const key = title.toLowerCase().replaceAll(' ', '_');
  const mobileTitle = abbreviation ? (
    <abbr title={title}>{abbreviation}</abbr>
  ) : (
    title
  );

  const itemClass = classNames(
    'mhv-c-sec-nav-item',
    'vads-u-text-align--left',
    'vads-u-align-content--center',
    {
      'mhv-u-sec-nav-active-style': isActive,
      'vads-u-font-weight--bold': isActive,
      'mhv-u-sec-nav-header-style': isHeader,
      'vads-u-font-size--lg': isHeader,
      'mhv-u-sec-nav-item-style': !isHeader,
    },
  );

  return (
    <div key={key} className={itemClass} data-testid="mhv-sec-nav-item">
      <a href={href} className="vads-u-text-decoration--none">
        {!!iconClass && <i className={iconClass} aria-hidden="true" />}
        <span className="mhv-u-sec-nav-item-title">{title}</span>
        <span className="mhv-u-sec-nav-short-title">{mobileTitle}</span>
      </a>
    </div>
  );
};

MhvSecondaryNavItem.propTypes = {
  href: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  abbreviation: PropTypes.string,
  isActive: PropTypes.bool,
  isHeader: PropTypes.bool,
};

export default MhvSecondaryNavItem;