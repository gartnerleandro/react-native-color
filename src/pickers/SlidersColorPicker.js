import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import HueSlider from '../sliders/HueSlider';
import SaturationSlider from '../sliders/SaturationSlider';
import LightnessSlider from '../sliders/LightnessSlider';

const modes = {
  hex: {
    getString: color => tinycolor(color).toHexString(),
    label: 'HEX'
  },
  hsl: {
    getString: color => tinycolor(color).toHslString(),
    label: 'HSL'
  },
  hsv: {
    getString: color => tinycolor(color).toHsvString(),
    label: 'HSV'
  },
  rgb: {
    getString: color => tinycolor(color).toRgbString(),
    label: 'RGB'
  }
};

export class SlidersColorPicker extends Component {
  constructor(props) {
    super(props);
    const color = tinycolor(this.props.color).toHsl();
    const inputColor = tinycolor(this.props.color).toHexString();
    this.state = {
      color,
      mode: 'hex',
      inputColor
    };
  }

  updateHue = h => {
    const updatedColor = { ...this.state.color, h };

    this.setState({ inputColor: modes[this.state.mode].getString(updatedColor), color: updatedColor })
  };

  updateSaturation = s => {
    const updatedColor = { ...this.state.color, s };

    this.setState({ inputColor: modes[this.state.mode].getString(updatedColor), color: updatedColor })
  };

  updateLightness = l => {
    const updatedColor = { ...this.state.color, l };

    this.setState({ inputColor: modes[this.state.mode].getString(updatedColor), color: updatedColor })
  };

  updateInput = newColor => this.setState({ inputColor: newColor ? modes[this.state.mode].getString(newColor) : newColor, color: newColor ? tinycolor(newColor).toHsl : tinycolor(this.props.color).toHsl });

  updateMode = key => this.setState({ mode: key, inputColor: modes[key].getString(this.state.color) });

  render() {
    const {
      visible,
      swatches,
      swatchesLabel,
      onOk,
      onCancel,
      okLabel,
      cancelLabel,
      showPreviewText,
    } = this.props;
    const colorHex = tinycolor(this.state.color).toHexString();
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onCancel}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.headerButton}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onOk(modes[this.props.returnMode].getString(this.state.color))
              }
            >
              <Text style={styles.headerButton}>{okLabel}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View
              style={[
                styles.colorPreview,
                {
                  backgroundColor: colorHex
                }
              ]}
            >
              {showPreviewText && (
                <>
                  <Text style={styles.lightText}>LIGHT TEXT</Text>
                  <Text style={styles.darkText}>DARK TEXT</Text>
                </>
              )}
            </View>
            <View style={styles.colorString}>
              <TextInput
                value={this.state.inputColor}
                onChangeText={this.updateInput}
                style={styles.colorHexText}
              />
            </View>
            <View style={styles.modesRow}>
              {Object.keys(modes).map(key => (
                <TouchableOpacity
                  onPress={() => this.updateMode(key)}
                  key={key}
                  style={[
                    styles.mode,
                    this.state.mode === key && styles.modeActive
                  ]}
                >
                  <Text
                    style={[
                      styles.modeText,
                      this.state.mode === key && styles.modeTextActive
                    ]}
                  >
                    {modes[key].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.sliders}>
              <HueSlider
                style={styles.sliderRow}
                gradientSteps={40}
                value={this.state.color.h}
                onValueChange={this.updateHue}
              />
              <SaturationSlider
                style={styles.sliderRow}
                gradientSteps={20}
                value={this.state.color.s}
                color={this.state.color}
                onValueChange={this.updateSaturation}
              />
              <LightnessSlider
                style={styles.sliderRow}
                gradientSteps={20}
                value={this.state.color.l}
                color={this.state.color}
                onValueChange={this.updateLightness}
              />
            </View>
            <Text style={styles.swatchesText}>{swatchesLabel}</Text>
            <View style={styles.swatchesContainer}>
              {swatches.map((swatch, index) => (
                <TouchableOpacity
                  key={swatch}
                  style={[
                    styles.swatch,
                    {
                      backgroundColor: swatch,
                      marginRight: index < swatches.length - 1 ? 16 : 0
                    }
                  ]}
                  onPress={() =>
                    this.setState({ color: tinycolor(swatch).toHsl() })
                  }
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default SlidersColorPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 0
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    marginHorizontal: 16
  },
  // TODO: Bigger touch area
  headerButton: {
    lineHeight: 22,
    fontSize: 17,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium'
      },
      ios: {
        fontWeight: '600',
        letterSpacing: -0.41
      }
    })
  },
  content: {
    flex: 1,
    marginHorizontal: 16
  },
  lightText: {
    lineHeight: 22,
    fontSize: 17,
    color: 'white',
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium'
      },
      ios: {
        fontWeight: '600',
        letterSpacing: -0.41
      }
    })
  },
  darkText: {
    lineHeight: 22,
    fontSize: 17,
    marginTop: 6,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium'
      },
      ios: {
        fontWeight: '600',
        letterSpacing: -0.41
      }
    })
  },
  colorPreview: {
    flex: 1,
    borderRadius: 3,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  modesRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  mode: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 16
  },
  modeActive: {
    backgroundColor: 'black',
    borderRadius: 3
  },
  modeText: {
    color: 'black',
    lineHeight: 18,
    fontSize: 13,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif'
      },
      ios: {
        fontWeight: '400',
        letterSpacing: -0.08
      }
    })
  },
  modeTextActive: {
    color: 'white'
  },
  sliders: {
    marginTop: 16
  },
  sliderRow: {
    marginTop: 16
  },
  colorString: {
    marginTop: 32,
    borderBottomWidth: 2,
    borderColor: '#DDDDDD'
  },
  colorHexText: {
    lineHeight: 24,
    fontSize: 20,
    color: '#000000',
    ...Platform.select({
      android: {
        fontFamily: 'monospace'
      },
      ios: {
        fontFamily: 'Courier New',
        fontWeight: '600',
        letterSpacing: 0.75
      }
    })
  },
  swatchesText: {
    marginTop: 16,
    lineHeight: 18,
    fontSize: 13,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif'
      },
      ios: {
        fontWeight: '400',
        letterSpacing: -0.08
      }
    }),
    color: '#555'
  },
  swatchesContainer: {
    marginTop: 12,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  swatch: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 100,
    maxWidth: 100,
    borderRadius: 3
  }
});

SlidersColorPicker.propTypes = {
  cancelLabel: PropTypes.string.isRequired,
  okLabel: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  showPreviewText: PropTypes.bool,
  swatches: PropTypes.arrayOf(PropTypes.string).isRequired,
  swatchesLabel: PropTypes.string.isRequired,
  value: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

SlidersColorPicker.defaultProps = {
  okLabel: 'Ok',
  cancelLabel: 'Cancel',
  value: '#70c1b3',
  showPreviewText: false,
};
