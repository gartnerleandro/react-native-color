import React, { useEffect, useState, useRef } from 'react';
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

const SlidersColorPicker = ({
  cancelLabel,
  color,
  okLabel,
  onCancel,
  onOk,
  showPreviewText,
  swatches,
  swatchesLabel,
  visible,
  returnMode,
}) => {
  const [ currentColor, setCurrentColor ] = useState(tinycolor(color).toHsl());
  const [ colorHex, setColorHex ] = useState(color);
  const [ mode, setMode] = useState('hex');
  const hexInputRef = useRef(null);

  useEffect(() => {
    setCurrentColor(tinycolor(color).toHsl());
    setColorHex(color);
  }, [color]);

  useEffect(() => {
    setColorHex(tinycolor(currentColor).toHexString());
  }, [currentColor]);

  const updateHue = (h) => setCurrentColor({ ...currentColor, h });
  const updateSaturation = (s) => setCurrentColor({ ...currentColor, s });
  const updateLightness = (l) => setCurrentColor({ ...currentColor, l });
  const updateHex = () => setCurrentColor(tinycolor(hexInputRef.current.value).toHsl());

  const onConfirm = () => onOk(modes[returnMode].getString(currentColor));

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
          <TouchableOpacity onPress={onConfirm}>
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
              value={modes[mode].getString(currentColor)}
              ref={hexInputRef}
              onBlur={updateHex}
              style={styles.colorHexText}
            />
          </View>
          <View style={styles.modesRow}>
            {Object.keys(modes).map((key) => (
              <TouchableOpacity
                onPress={() => setMode(key)}
                key={key}
                style={[
                  styles.mode,
                  mode === key && styles.modeActive
                ]}
              >
                <Text
                  style={[
                    styles.modeText,
                    mode === key && styles.modeTextActive
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
              value={currentColor.h}
              onValueChange={updateHue}
            />
            <SaturationSlider
              style={styles.sliderRow}
              gradientSteps={20}
              value={currentColor.s}
              color={currentColor}
              onValueChange={updateSaturation}
            />
            <LightnessSlider
              style={styles.sliderRow}
              gradientSteps={20}
              value={currentColor.l}
              color={currentColor}
              onValueChange={updateLightness}
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
                onPress={() => setCurrentColor(tinycolor(swatch).toHsl())}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
