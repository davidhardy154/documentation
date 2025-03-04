// VariantSelect: allows a variant to be set up within a document hierarchy
//
// For example, given two paths `/docs/v1.0/foo` and `/docs/v2.0/foo`, the
// second folder acts as a variant.  If you use <VariantSelect root="/docs">
// then you'll get a selection for the different variants (v1.0, v2.0).

import React from 'react';
import styled from 'styled-components';
import { Dropdown, themeGet } from '@primer/components';
import NavHierarchy from '../nav-hierarchy'

VariantSelect.Menu = styled(Dropdown.Menu)`
  width: ${props => props.width ? props.width : '160px'};
`

VariantSelect.Button = styled(Dropdown.Button)`
  &:focus {
    box-shadow: 0 0 0 3px ${themeGet('colors.blue.5')};
  }
`

function VariantSelect(props) {
  const path = NavHierarchy.getPath(props.location.pathname);
  const vp = NavHierarchy.getVariantAndPage(props.root, path);
  const wrapper = React.createRef(null)

  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('v') === 'true') {
      wrapper?.current?.querySelector('summary')?.focus()

      const url = new URL(window.location);
      url.searchParams.delete('v')
      window.history.replaceState(null, '', url.toString());
    }
  }, [])

  if (!vp) {
      return null;
  }

  const variantPages = NavHierarchy.getVariantsForPage(props.root, vp.page);
  const items = [];
  let selectedItem = variantPages[0];
  
  if (variantPages.length === 0) {
      return null;
  }

  /** 
   *  We should use '@primer/react' package, as '@primer/components' package depricated and moved to '@primer/react'.
   *  We have no closing/opening control with current '@primer/components' package, so document.body click event used for closing purpose.
   */
  // TODO: We should use 'setOpen' function returned by the useDetails hook when we move to '@primer/react' package. https://primer.style/react/deprecated/Dropdown
  function collapseDropdown () {
    document.body.click()
  }

  function anchorClickHandler(event, url) {
    event.preventDefault()
    window.location.href = url + "?v=true";
  }

  function onItemEnterKey(event, url) {
    if (event.key === 'Enter') {
        window.location.href = url + "?v=true";
    }
  }

  variantPages.forEach((match, index) => {
      if (match.page.url === path) {
          selectedItem = match;
      }
      items.push(
        <a
          id={match.variant.shortName}
          style={{ textDecoration: 'none' }}
          tabIndex={0}
          key={match.variant.title}
          href={match.page.url}
          onClick={e => anchorClickHandler(e, match.page.url)}
          onKeyDown={e => onItemEnterKey(e, match.page.url)}
          onBlur={index === (variantPages.length - 1) ? collapseDropdown : undefined}
          aria-label={`${match.variant.title}. List items ${index + 1} of ${variantPages.length}`}
        >
          <Dropdown.Item>{match.variant.title}</Dropdown.Item>
        </a>
      );
  });

  /** 
   *  We should use '@primer/react' package as '@primer/components' package depricated and moved to '@primer/react'.
   *  We have no closing/opening control with current '@primer/components' package, so document.body click event used for closing purpose.
   */
  // TODO: We should use 'setOpen' function returned by the useDetails hook when we move to '@primer/react' package. https://primer.style/react/deprecated/Dropdown
  function onDropDownKeyDown (event) {
    if (event.key === 'Escape') {
        document.body.click()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} ref={wrapper}>
      <label id="label-versions-list-item" htmlFor='variant-select'>Select CLI Version:</label>
      <Dropdown id="versions-list-item" aria-labelledby={selectedItem?.variant?.shortName} onKeyDown={onDropDownKeyDown} overlay={props.overlay}>
          <VariantSelect.Button aria-label='Version release'>{selectedItem.variant.title}</VariantSelect.Button>
          <VariantSelect.Menu direction={props.direction} width={props.menuWidth}>
              {items}
          </VariantSelect.Menu>
      </Dropdown>
    </div>
  );
}

export default VariantSelect
