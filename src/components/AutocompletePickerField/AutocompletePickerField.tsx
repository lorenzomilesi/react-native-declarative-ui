import find from 'lodash.find';
import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInputProperties,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { FloatingLabel, TextInputInstance } from '../../base/FloatingLabel';
import { OpenPickerFieldIcon } from '../../base/icons/OpenPickerFieldIcon';
import { ComposableItem } from '../../models/composableItem';
import { Colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export interface IAutocompletePickerFieldProps extends TextInputProperties {
  onRef?: (input: TextInputInstance) => void;
  label: string;
  onPress: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  error?: string;
  disableErrorMessage?: boolean;

  options?: ComposableItem[] | string[];
  displayProperty?: string;
  keyProperty?: string;
  itemValue?: ComposableItem | string;
  isPercentage?: boolean;
  //   reduxProp?: string;
}

type State = {
  isFocused: boolean;
} & React.ComponentState;

export default class AutocompletePickerField extends React.Component<IAutocompletePickerFieldProps, State> {
  constructor(props: IAutocompletePickerFieldProps) {
    super(props);
    this.state = {
      isFocused: false
    };
  }

  render() {
    // const { isPercentage } = this.props;
    const {
      onRef,
      onFocus,
      onBlur,
      onPress,
      displayProperty,
      keyProperty,
      itemValue,
      options,
      error,
      ...rest
    } = this.props;

    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View
            style={[
              globalStyles.inputContainer,
              { borderColor: this.state.isFocused ? Colors.LIGHT_THIRD_BLUE : error ? Colors.LIGHT_RED : 'transparent' }
            ]}
          >
            <FloatingLabel
              {...rest}
              onRef={input => {
                if (onRef && input) {
                  onRef(input);
                }
              }}
              editable={false}
              isSelectField={true}
              value={this.retrieveDisplayValue(itemValue)}
              style={[globalStyles.input, this.retrieveBorderColor(), { paddingRight: 28 }]}
              labelStyle={{ backgroundColor: 'transparent', color: Colors.GRAY_600 }}
              inputStyle={styles.inputStyle}
              dirtyStyle={{
                fontSize: 15,
                top: Platform.select({ ios: -14, android: -16 })
              }}
              cleanStyle={{
                fontSize: 17,
                top: Platform.select({ ios: 0, android: -2 })
              }}
              onFocus={() => {
                if (!this.state.isFocused) {
                  this.setState({
                    isFocused: true
                  });
                }

                if (this.props.onFocus) {
                  this.props.onFocus();
                }
              }}
              onBlur={() => {
                if (this.state.isFocused) {
                  this.setState({ isFocused: false });
                }

                if (this.props.onBlur) {
                  this.props.onBlur();
                }
              }}
            >
              {this.props.label}
            </FloatingLabel>
            <OpenPickerFieldIcon onOpenPickerIconClicked={onPress} />
          </View>
        </TouchableWithoutFeedback>
        {!!error && this.renderError(error, !!this.props.disableErrorMessage)}
      </View>
    );
  }

  private renderError = (error: string, disableErrorMessage: boolean) => {
    if (disableErrorMessage) {
      return null;
    }

    return <Text style={styles.errorMessage}>{error}</Text>;
  };

  private retrieveBorderColor = () => {
    const { error, value } = this.props;
    const { isFocused } = this.state;

    if (isFocused) {
      return {
        borderColor: Colors.PRIMARY_BLUE
      };
    }

    if (error) {
      return {
        borderColor: Colors.RED
      };
    }

    if (Boolean(value)) {
      return {
        borderColor: Colors.GRAY_500
      };
    }

    return {
      borderColor: Colors.GRAY_400
    };
  };

  private retrieveDisplayValue = (itemValue?: ComposableItem | string) => {
    // Add isPercentage check
    const { displayProperty, keyProperty, options } = this.props;

    if (!itemValue) {
      return undefined;
    }

    if (displayProperty && typeof itemValue === 'object') {
      return String(itemValue[displayProperty]);
    }

    if (options && displayProperty && keyProperty && typeof itemValue === 'object') {
      return String(find(options as ComposableItem[], item => item[keyProperty] === itemValue)![displayProperty]);
    }

    return String(itemValue);
  };
}

const styles = StyleSheet.create({
  containerStyle: {},
  fieldGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputStyle: {
    borderWidth: 0,
    padding: 0,
    fontSize: 17
  },
  rightIconContainer: {
    position: 'absolute',
    right: 5,
    backgroundColor: 'transparent'
  },
  rightIcon: {
    padding: 5
  },
  errorMessage: {
    color: Colors.RED,
    fontSize: 12
  }
});
