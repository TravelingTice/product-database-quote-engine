import React from 'react';

import propTypes from 'prop-types';
import DataInputSm from '../../UtilComps/DataInputSm';

const PackingDimensionsTable = props => (
  <table className="table">
    <thead>
      <tr>
        <td className="before"></td>
        <td>Height</td>
        <td>Width</td>
        <td>Depth</td>
      </tr>
    </thead>
    <tbody>

      {/* Shrink */}
      <tr>
        <td className="before">Shrink</td>
        <td className="input">
          <DataInputSm
          xAfter={true}
          onChange={props.onChange}
          value={props.shrinkH}
          id="shrink-h"
          name="shrinkH"/>
        </td>
        <td className="input">
          <DataInputSm
          xAfter={true}
          onChange={props.onChange}
          value={props.shrinkW}
          id="shrink-w"
          name="shrinkW"/>
        </td>
        <td className="input">
          <DataInputSm
          onChange={props.onChange}
          value={props.shrinkD}
          id="shrink-d"
          name="shrinkD"/>
        </td>
      </tr>

      {/* PP Plastic */}
      <tr>
        <td className="before">PP Plastic</td>
        <td className="input">
          <DataInputSm
          xAfter={true}
          onChange={props.onChange}
          value={props.ppH}
          id="pp-h"
          name="ppH"/>
        </td>
        <td className="input">
          <DataInputSm
          xAfter={true}
          onChange={props.onChange}
          value={props.ppW}
          id="pp-w"
          name="ppW"/>
        </td>
        <td className="input">
          <DataInputSm
          onChange={props.onChange}
          value={props.ppD}
          id="pp-d"
          name="ppD"/>
        </td>
      </tr>

      {/* Display */}
      <tr>
        <td className="before">Display</td>
        <td className="input">
          <DataInputSm
          xAfter={true}
          onChange={props.onChange}
          value={props.displayH}
          id="display-h"
          name="displayH"/>
        </td>
        <td className="input">
          <DataInputSm
          xAfter={true}
          onChange={props.onChange}
          value={props.displayW}
          id="display-w"
          name="displayW"/>
        </td>
        <td className="input">
          <DataInputSm
          onChange={props.onChange}
          value={props.displayD}
          id="display-d"
          name="displayD"/>
        </td>
      </tr>

    </tbody>
  </table>
);

PackingDimensionsTable.propTypes = {
  shrinkH: propTypes.string.isRequired,
  shrinkW: propTypes.string.isRequired,
  shrinkD: propTypes.string.isRequired,
  ppH: propTypes.string.isRequired,
  ppW: propTypes.string.isRequired,
  ppD: propTypes.string.isRequired,
  displayH: propTypes.string.isRequired,
  displayW: propTypes.string.isRequired,
  displayD: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
}

export default PackingDimensionsTable;