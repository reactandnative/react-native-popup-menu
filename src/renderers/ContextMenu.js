import React from 'react';
import { Animated, StyleSheet } from 'react-native';

const axisPosition = (oDim, wDim, tPos, tDim) => {
  // if options are bigger than window dimension, then render at 0
  if (oDim > wDim) {
    return 0;
  }
  // render at trigger position if possible
  if (tPos + oDim <= wDim) {
    return tPos;
  }
  // aligned to the trigger from the bottom (right)
  if (tPos + tDim - oDim >= 0) {
    return tPos + tDim - oDim;
  }
  // compute center position
  let pos = Math.round(tPos + (tDim / 2) - (oDim / 2));
  // check top boundary
  if (pos < 0) {
    return 0;
  }
  // check bottom boundary
  if (pos + oDim > wDim) {
    return wDim - oDim;
  }
  // if everything ok, render in center position
  return pos;
};

export const computePosition = ({ windowLayout, triggerLayout, optionsLayout }) => {
  const { width: wWidth, height: wHeight } = windowLayout;
  const { x: tX, y: tY, height: tHeight, width: tWidth } = triggerLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const top = axisPosition(oHeight, wHeight, tY, tHeight);
  const left = axisPosition(oWidth, wWidth, tX, tWidth);
  return { top, left };
};


export default class ContextMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scaleAnim: new Animated.Value(0.1),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.scaleAnim, {
      duration: 80,
      toValue: 1
    }).start();
  }

  render() {
    const { style, children, layouts, ...other } = this.props;
    const animation = {
      transform: [ { scale: this.state.scaleAnim } ]
    };
    const position = computePosition(layouts);
    return (
      <Animated.View {...other} style={[styles.options, style, animation, position]}>
        {children}
      </Animated.View>
    );
  }

}

// public exports
ContextMenu.computePosition = computePosition;

export const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'white',
    width: 200,

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5,
  },
});
