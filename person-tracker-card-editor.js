// Person Tracker Card Editor - Fixed Version
// Fix for all reported bugs

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class PersonTrackerCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _helpers: {},
      _selectedTab: { type: String }
    };
  }

  constructor() {
    super();
    this._selectedTab = 'base';
  }

  setConfig(config) {
    this._config = {
      layout: 'classic',
      compact_width: 300,
      show_entity_picture: true,
      show_name: true,
      show_last_changed: true,
      show_battery: true,
      show_watch_battery: true,
      show_activity: true,
      show_distance: true,
      show_travel_time: true,
      show_connection: true,
      aspect_ratio: '1/0.7',
      triggers_update: 'all',
      battery_position: 'top-right',
      watch_battery_position: 'top-right-2',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right',
      battery_font_size: '13px',
      watch_battery_font_size: '13px',
      activity_font_size: '13px',
      distance_font_size: '12px',
      travel_font_size: '12px',
      connection_font_size: '12px',
      ...config
    };

    // fallback for positions
    const positionDefaults = {
      battery_position: 'top-right',
      watch_battery_position: 'top-right-2',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right'
    };

    for (const key in positionDefaults) {
      if (!this._config[key]) {
        this._config[key] = positionDefaults[key];
      }
    }

    if (!this._config.triggers_update) {
      this._config.triggers_update = 'all';
    }
  }


  static get styles() {
    return css`
      .card-config {
        padding: 16px;
      }

      .tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--divider-color);
      }

      .tab {
        padding: 8px 16px;
        cursor: pointer;
        background: none;
        border: none;
        color: var(--primary-text-color);
        font-size: 14px;
        transition: all 0.3s;
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tab:hover {
        background: var(--secondary-background-color);
      }

      .tab.active {
        color: var(--primary-color);
      }

      .tab.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
      }

      .section {
        margin-bottom: 24px;
      }

      .section-title {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .config-row {
        display: flex;
        align-items: center;
        padding: 8px 0;
        min-height: 40px;
      }

      .config-row ha-switch {
        margin-left: auto;
      }

      .config-row ha-textfield,
      .config-row ha-select {
        width: 100%;
      }

      .config-label {
        flex: 1;
      }

      .config-value {
        flex: 2;
        margin-left: 16px;
      }

      .two-column {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      ha-entity-picker {
        display: block;
        margin: 8px 0;
      }

      ha-textfield {
        display: block;
        margin: 8px 0;
      }

      ha-select {
        display: block;
        margin: 8px 0;
        width: 100%;
      }

      .sensor-group {
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
      }

      .sensor-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      .sensor-icon {
        margin-right: 8px;
        color: var(--primary-color);
      }

      .sensor-title {
        font-weight: 500;
        flex: 1;
      }

      .state-item {
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
      }

      .state-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      mwc-button {
        margin-top: 8px;
      }

      .add-button {
        width: 100%;
      }

      .remove-button {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 20px;
        color: var(--error-color);
      }

      .preview-box {
        background: var(--secondary-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 16px 0;
      }

      .preview-title {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .color-picker {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        cursor: pointer;
        position: relative;
      }

      input[type="color"] {
        opacity: 0;
        position: absolute;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }

      .info-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        line-height: 1.4;
      }

      .position-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }

      pre {
        font-size: 11px;
        overflow-x: auto;
        background: var(--card-background-color);
        padding: 8px;
        border-radius: 4px;
      }

      @media (max-width: 600px) {
        .tabs {
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .two-column {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="tabs">
          <button
            class="tab ${this._selectedTab === 'base' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'base'}">
            <ha-icon icon="mdi:card-account-details"></ha-icon>
            Basics
          </button>
          <button
            class="tab ${this._selectedTab === 'sensors' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'sensors'}">
            <ha-icon icon="mdi:leak"></ha-icon>
            Sensors
          </button>
          ${this._config.layout !== 'compact' ? html`
            <button
              class="tab ${this._selectedTab === 'position' ? 'active' : ''}"
              @click="${() => this._selectedTab = 'position'}">
              <ha-icon icon="mdi:grid"></ha-icon>
              Position
            </button>
          ` : ''}
          <button
            class="tab ${this._selectedTab === 'states' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'states'}">
            <ha-icon icon="mdi:palette"></ha-icon>
            States
          </button>
          <button
            class="tab ${this._selectedTab === 'style' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'style'}">
            <ha-icon icon="mdi:brush"></ha-icon>
            Style
          </button>
        </div>

        ${this._selectedTab === 'base' ? this._renderBaseTab() : ''}
        ${this._selectedTab === 'sensors' ? this._renderSensorsTab() : ''}
        ${this._selectedTab === 'position' ? this._renderPositionTab() : ''}
        ${this._selectedTab === 'states' ? this._renderStatesTab() : ''}
        ${this._selectedTab === 'style' ? this._renderStyleTab() : ''}
      </div>
    `;
  }

  _renderBaseTab() {
    if (!this._config) {
      return html`<div>Configuration not available.</div>`;
    }

    const entityValue = this._config.entity || '';

    return html`
      <div class="section">
        <div class="section-title">Basic Configuration</div>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${entityValue}
          .label=${'Person Entity (required)'}
          .includeDomains=${['person']}
          .required=${true}
          @value-changed=${(e) => this._valueChanged(e, 'entity')}>
        </ha-entity-picker>

        <ha-select
          label="Layout"
          .value=${this._config.layout || 'classic'}
          @closed=${(e) => this._handleLayoutChange(e)}>
          <mwc-list-item value="classic">Classic</mwc-list-item>
          <mwc-list-item value="compact">Compact</mwc-list-item>
        </ha-select>

        ${this._config.layout === 'compact' ? html`
          <ha-textfield
            label="Compact width (px)"
            type="number"
            min="200"
            max="500"
            .value=${this._config.compact_width || '300'}
            @input=${(e) => this._valueChanged(e, 'compact_width')}
            helper-text="Maximum width in pixels (default: 300px)">
          </ha-textfield>
        ` : ''}

        <ha-textfield
          label="Custom name (optional)"
          .value=${this._config.name || ''}
          @input=${(e) => this._valueChanged(e, 'name')}>
        </ha-textfield>

        <ha-textfield
          label="Custom image URL"
          .value=${this._config.entity_picture || ''}
          @input=${(e) => this._valueChanged(e, 'entity_picture')}
          helper-text="E.g.: /local/photos/mario.jpg">
        </ha-textfield>

        ${this._config.layout !== 'compact' ? html`
          <ha-textfield
            label="Aspect ratio"
            .value=${this._config.aspect_ratio || '1/0.7'}
            @input=${(e) => this._valueChanged(e, 'aspect_ratio')}
            helper-text="Format: width/height (e.g., 1/0.7)">
          </ha-textfield>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">Display Options</div>

        <div class="config-row">
          <span class="config-label">Show person image</span>
          <ha-switch
            .checked=${this._config.show_entity_picture !== false}
            @change=${(e) => this._valueChanged(e, 'show_entity_picture')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">Show name</span>
          <ha-switch
            .checked=${this._config.show_name !== false}
            @change=${(e) => this._valueChanged(e, 'show_name')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">Show last updated</span>
          <ha-switch
            .checked=${this._config.show_last_changed !== false}
            @change=${(e) => this._valueChanged(e, 'show_last_changed')}>
          </ha-switch>
        </div>
      </div>
    `;
  }


  _renderSensorsTab() {
    const entityBase = this._config.entity
      ? this._config.entity.replace('person.', '')
      : 'example';

    return html`
      <div class="section">
        <div class="section-title">Automatic Sensors</div>
        <p class="info-text">
          Sensors are detected automatically based on the selected person entity.
          Default pattern: sensor.phone_${entityBase}_* and sensor.watch_${entityBase}_*
        </p>

        <!-- Battery -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:battery" class="sensor-icon"></ha-icon>
            <span class="sensor-title">Battery</span>
            <ha-switch
              .checked=${this._config.show_battery !== false}
              @change=${(e) => this._valueChanged(e, 'show_battery')}>
            </ha-switch>
          </div>

          ${this._config.show_battery !== false ? html`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.battery_sensor || `sensor.phone_${entityBase}_battery_level`}
              .label=${'Battery sensor'}
              .includeDomains=${['sensor']}
              @value-changed=${(e) => this._valueChanged(e, 'battery_sensor')}>
            </ha-entity-picker>
          ` : ''}
        </div>

        <!-- Watch Battery -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:watch" class="sensor-icon"></ha-icon>
            <span class="sensor-title">Watch Battery</span>
            <ha-switch
              .checked=${this._config.show_watch_battery !== false}
              @change=${(e) => this._valueChanged(e, 'show_watch_battery')}>
            </ha-switch>
          </div>

          ${this._config.show_watch_battery !== false ? html`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.watch_battery_sensor || `sensor.watch_${entityBase}_battery_level`}
              .label=${'Watch battery sensor'}
              .includeDomains=${['sensor']}
              @value-changed=${(e) => this._valueChanged(e, 'watch_battery_sensor')}>
            </ha-entity-picker>
          ` : ''}
        </div>

        <!-- Activity -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:walk" class="sensor-icon"></ha-icon>
            <span class="sensor-title">Activity</span>
            <ha-switch
              .checked=${this._config.show_activity !== false}
              @change=${(e) => this._valueChanged(e, 'show_activity')}>
            </ha-switch>
          </div>

          ${this._config.show_activity !== false ? html`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.activity_sensor || `sensor.phone_${entityBase}_activity`}
              .label=${'Activity sensor'}
              .includeDomains=${['sensor']}
              @value-changed=${(e) => this._valueChanged(e, 'activity_sensor')}>
            </ha-entity-picker>
          ` : ''}
        </div>

        <!-- Connection -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:wifi" class="sensor-icon"></ha-icon>
            <span class="sensor-title">Connection</span>
            <ha-switch
              .checked=${this._config.show_connection !== false}
              @change=${(e) => this._valueChanged(e, 'show_connection')}>
            </ha-switch>
          </div>

          ${this._config.show_connection !== false ? html`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.connection_sensor || `sensor.phone_${entityBase}_connection_type`}
              .label=${'Connection sensor'}
              .includeDomains=${['sensor']}
              @value-changed=${(e) => this._valueChanged(e, 'connection_sensor')}>
            </ha-entity-picker>
          ` : ''}
        </div>

        <!-- Distance -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:home-map-marker" class="sensor-icon"></ha-icon>
            <span class="sensor-title">Distance from Home</span>
            <ha-switch
              .checked=${this._config.show_distance !== false}
              @change=${(e) => this._valueChanged(e, 'show_distance')}>
            </ha-switch>
          </div>

          ${this._config.show_distance !== false ? html`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.distance_sensor || `sensor.waze_${entityBase}`}
              .label=${'Distance sensor'}
              .includeDomains=${['sensor']}
              @value-changed=${(e) => this._valueChanged(e, 'distance_sensor')}>
            </ha-entity-picker>
          ` : ''}
        </div>

        <!-- Work Time -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:car-clock" class="sensor-icon"></ha-icon>
            <span class="sensor-title">Travel Time</span>
            <ha-switch
              .checked=${this._config.show_travel_time !== false}
              @change=${(e) => this._valueChanged(e, 'show_travel_time')}>
            </ha-switch>
          </div>

          ${this._config.show_travel_time !== false ? html`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.travel_sensor || `sensor.home_work_${entityBase}`}
              .label=${'Travel time sensor'}
              .includeDomains=${['sensor']}
              @value-changed=${(e) => this._valueChanged(e, 'travel_sensor')}>
            </ha-entity-picker>
          ` : ''}
        </div>
      </div>
    `;
  }


  _renderPositionTab() {
    if (!this._config) {
      return html`<div>Configuration not available.</div>`;
    }

    return html`
      <div class="section">
        <div class="section-title">Element Positions</div>
        <p class="info-text">
          Configure the position of each element on the card. Available only in Classic layout.
        </p>

        ${this._config.show_battery !== false ? html`
          ${this._renderPositionButtons('battery_position', 'Battery position')}
        ` : ''}

        ${this._config.show_watch_battery !== false ? html`
          ${this._renderPositionButtons('watch_battery_position', 'Watch battery position')}
        ` : ''}

        ${this._config.show_activity !== false ? html`
          ${this._renderPositionButtons('activity_position', 'Activity position')}
        ` : ''}

        ${this._config.show_connection !== false ? html`
          ${this._renderPositionButtons('connection_position', 'Connection position')}
        ` : ''}

        ${this._config.show_distance !== false ? html`
          ${this._renderPositionButtons('distance_position', 'Distance position')}
        ` : ''}

        ${this._config.show_travel_time !== false ? html`
          ${this._renderPositionButtons('travel_position', 'Travel time position')}
        ` : ''}
      </div>
    `;
  }



  _renderStatesTab() {
    const states = this._config.state || [];

    return html`
      <div class="section">
        <div class="section-title">Custom States</div>
        <p class="info-text">
          Configure how the different person states are displayed
        </p>

        ${states.map((state, index) => html`
          <div class="state-item">
            <div class="state-header">
              <span>${state.name || state.value || 'New state'}</span>
              <ha-icon-button
                icon="mdi:delete"
                class="remove-button"
                @click=${() => this._removeState(index)}>
              </ha-icon-button>
            </div>

            <ha-textfield
              label="State value (e.g., home, not_home)"
              .value=${state.value || ''}
              @input=${(e) => this._updateState(index, 'value', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="Displayed name"
              .value=${state.name || ''}
              @input=${(e) => this._updateState(index, 'name', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="Custom image (optional)"
              .value=${state.entity_picture || ''}
              @input=${(e) => this._updateState(index, 'entity_picture', e.target.value)}>
            </ha-textfield>

            <div class="config-row">
              <span class="config-label">Name color</span>
              <div class="color-picker">
                <div class="color-preview"
                     style="background-color: ${state.styles?.name?.color || '#7DDA9F'}">
                  <input type="color"
                         .value=${state.styles?.name?.color || '#7DDA9F'}
                         @input=${(e) => this._updateStateColor(index, e.target.value)}>
                </div>
                <ha-textfield
                  .value=${state.styles?.name?.color || '#7DDA9F'}
                  @input=${(e) => this._updateStateColor(index, e.target.value)}
                  pattern="^#[0-9A-Fa-f]{6}$">
                </ha-textfield>
              </div>
            </div>
          </div>
        `)}

        <mwc-button
          outlined
          icon="mdi:plus"
          class="add-button"
          @click=${this._addState}>
          Add State
        </mwc-button>
      </div>

      <div class="preview-box">
        <div class="preview-title">Default States</div>
        <mwc-button
          @click=${this._addDefaultStates}
          icon="mdi:magic">
          Add Default States
        </mwc-button>
      </div>
    `;
  }

  _renderStyleTab() {
    return html`
      <div class="section">
        <div class="section-title">Card Style Customization</div>

        ${this._config.layout !== 'compact' ? html`
          <div class="two-column">
            <ha-textfield
              label="Name font size"
              .value=${this._config.name_font_size || '20px'}
              @input=${(e) => this._valueChanged(e, 'name_font_size')}>
            </ha-textfield>

            <ha-textfield
              label="State font size"
              .value=${this._config.state_font_size || '14px'}
              @input=${(e) => this._valueChanged(e, 'state_font_size')}>
            </ha-textfield>
          </div>
        ` : ''}

        <ha-textfield
          label="Card background"
          .value=${this._config.card_background || 'rgba(255,255,255,0.05)'}
          @input=${(e) => this._valueChanged(e, 'card_background')}
          helper-text="E.g.: rgba(255,255,255,0.05) or #1a1a2e">
        </ha-textfield>

        <ha-textfield
          label="Border radius"
          .value=${this._config.card_border_radius || '15px'}
          @input=${(e) => this._valueChanged(e, 'card_border_radius')}>
        </ha-textfield>

        ${this._config.layout !== 'compact' ? html`
          <ha-textfield
            label="Image size (%)"
            type="number"
            min="10"
            max="100"
            .value=${this._config.picture_size || '55'}
            @input=${(e) => this._valueChanged(e, 'picture_size')}>
          </ha-textfield>
        ` : ''}
      </div>


    `;
  }

  _renderPositionButtons(configKey, label) {
    const options = [
      { value: 'top-left', label: 'Top Left' },
      { value: 'top-right', label: 'Top Right' },
      { value: 'bottom-left', label: 'Bottom Left' },
      { value: 'bottom-right', label: 'Bottom Right' }
    ];
    const selected = this._config[configKey] || options[0].value;

    return html`
      <div class="sensor-group">
        <div class="sensor-header">
          <span class="sensor-title">${label}</span>
        </div>
        <div class="position-button-group buttons">
          ${options.map(opt => html`
            <button
              class="${selected === opt.value ? 'selected' : ''}"
              @click="${() => this._onSelectPosition(configKey, opt.value)}">
              ${opt.label}
            </button>
          `)}
        </div>
      </div>
    `;
  }



  _onSelectPosition(configKey, value) {
    this._config = { ...this._config, [configKey]: value };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _valueChanged(ev, configValue) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();
    ev.preventDefault();

    const target = ev.target || ev.currentTarget;
    let value;

    if (target.type === 'checkbox' || target.tagName === 'HA-SWITCH') {
      value = target.checked;
    } else if (target.tagName === 'HA-ENTITY-PICKER') {
      value = ev.detail?.value;
    } else {
      value = target.value;
    }

    console.log(`_valueChanged called with configValue=${configValue} and value=`, value);

    if (value === '' || value === undefined) {
      delete this._config[configValue];
    } else {
      this._config = { ...this._config, [configValue]: value };
    }

    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }


  _handleLayoutChange(ev) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();
    
    const target = ev.target;
    const value = target.value;

    if (!value || (value !== 'classic' && value !== 'compact')) {
      console.warn('Invalid layout value:', value);
      return;
    }

    this._config = { ...this._config, layout: value };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }


  _selectChanged(ev, configValue) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();
    ev.preventDefault();

    const value = ev.detail?.value;

    // Allowed values for triggers_update
    const validTriggerValues = ['all', 'entity', 'custom'];

    // Allowed values for layout
    const validLayoutValues = ['classic', 'compact'];

    // Allowed values for positions
    const validPositions = [
      'top-left', 'top-right', 'bottom-left', 'bottom-right',
      'top-left-2', 'top-right-2', 'bottom-left-2', 'bottom-right-2'
    ];

    if (!value || typeof value !== 'string') {
      console.warn(`Invalid value (type or undefined) for ${configValue}:`, value);
      return;
    }

    if (configValue === 'triggers_update') {
      if (!validTriggerValues.includes(value)) {
        console.warn(`Invalid triggers_update value:`, value);
        return;
      }
    } else if (configValue === 'layout') {
      if (!validLayoutValues.includes(value)) {
        console.warn(`Invalid layout value:`, value);
        return;
      }
    } else {
      if (!validPositions.includes(value)) {
        console.warn(`Invalid position value for ${configValue}:`, value);
        return;
      }
    }

    this._config = { ...this._config, [configValue]: value };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }





  _addState() {
    const states = this._config.state || [];
    states.push({
      value: '',
      name: '',
      styles: {
        name: {
          color: '#7DDA9F'
        }
      }
    });

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _removeState(index) {
    const states = [...(this._config.state || [])];
    states.splice(index, 1);

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _updateState(index, field, value) {
    const states = [...(this._config.state || [])];
    states[index] = { ...states[index], [field]: value };

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _updateStateColor(index, color) {
    const states = [...(this._config.state || [])];
    states[index] = {
      ...states[index],
      styles: {
        ...states[index].styles,
        name: {
          ...states[index].styles?.name,
          color: color
        }
      }
    };

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _addDefaultStates() {
    const defaultStates = [
      {
        value: 'home',
        name: '🏡 Home',
        styles: { name: { color: '#7DDA9F' } }
      },
      {
        value: 'not_home',
        name: '🏃‍♂️ Away from Home',
        styles: { name: { color: '#93ADCB' } }
      },
      {
        value: 'office',
        name: '🏢 Office',
        styles: { name: { color: '#FFD700' } }
      },
      {
        value: 'unknown',
        name: '❓ Unknown',
        styles: { name: { color: '#808080' } }
      }
    ];

    this._config = { ...this._config, state: defaultStates };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _fireEvent(type, detail) {
    const event = new CustomEvent(type, {
      detail: detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

// Register the editor
if (!customElements.get('person-tracker-card-editor')) {
  customElements.define('person-tracker-card-editor', PersonTrackerCardEditor);
  console.log('Person Tracker Card Editor registered (fixed version)');
}

// Export for the main card
window.PersonTrackerCardEditor = PersonTrackerCardEditor;
