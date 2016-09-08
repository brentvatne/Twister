/**
 * @providesModule WordChooser
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';

let Actions = require('Actions');
let {Colors, Dimensions, BaseStyles} = require('Constants');


class LetterChooser extends React.Component {

  onPress() {
    // This gets fired onTouchStart so that it feels more responsive and
    // more like the native keyboard. Depending on how fast we type, we
    // might end up hitting multiple keys at the same time, so just put
    // the letter in on the start of the press instead of waiting for the
    // press to release.
    if (!this.props.letterObject.used && !this.props.disabled) {
      Actions.chooseLetter(this.props.letterObject);
    }
  }

  render() {
    if (this.props.disabled) {
      return (
        <View
          style={[
            BaseStyles.centerContent,
            BaseStyles.disabledButton,
            styles.letterChooser]}
          >
          <Text style={BaseStyles.largeText}>
            {this.props.letterObject.letter}
          </Text>
        </View>
      );
    }
    else if (this.props.letterObject.used) {
      return (
        <View
          style={[
            BaseStyles.centerContent,
            styles.letterChooser]}
          >
          <Text style={BaseStyles.largeText} />
        </View>
      );
    } else {
      return (
        <View
          style={[
            BaseStyles.centerContent,
            styles.letterChooser]}
            onTouchStart={() => this.onPress()}
          >
          <Text style={BaseStyles.largeText}>
            {this.props.letterObject.letter}
          </Text>
        </View>
      );
    }
  }
}

class LetterChoice extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: new Animated.Value(1)
    };
  }

  componentDidMount() {
    this.state.scale.setValue(0.0);
    Animated.timing(this.state.scale, {
      toValue: 1.0,
      duration: 100
    }).start();
  }

  render() {
    return (
      <Animated.View style={[
          BaseStyles.centerContent,
          {
            transform: [{'scale': this.state.scale}]
          }
        ]}
        >
        <Text style={BaseStyles.largeText}>{this.props.letter}</Text>
      </Animated.View>
    );
  }

}

class WordChoice extends React.Component {

  render() {
    return (
      <TouchableWithoutFeedback onPress={Actions.backspace}>
        <View
          style={[
            BaseStyles.centerContent,
            styles.wordChoiceContainer
            ]}
          onPress={Actions.backspace}
          >
          {this.props.letters.map((letterObject, index) => {
            return (
              <LetterChoice key={index} letter={letterObject.letter} />
            );
          })}
        </View>
      </TouchableWithoutFeedback>
    );
  }

}


class ActionButton extends React.Component {

  render() {
    if (this.props.disabled) {
      return (
        <View
          style={[
            BaseStyles.centerContent,
            BaseStyles.disabledButton,
            styles.actionButtonContainer]}
          >
          <Image source={{uri: this.props.uri}} style={styles.actionButton}/>
        </View>
      );
    } else {
      return (
        <TouchableHighlight
          style={[BaseStyles.centerContent, styles.actionButtonContainer]}
          onPressIn={this.props.onPress}
          delayPressIn={0}
          >
          <Image source={{uri: this.props.uri}} style={styles.actionButton}/>
        </TouchableHighlight>
      );
    }
  }

}


const SHUFFLE_IMAGE_URI = "http://flubstep.com/images/ic_autorenew_black_24dp/ios/ic_autorenew.imageset/ic_autorenew_3x.png";
const BACKSPACE_IMAGE_URI = "http://flubstep.com/images/ic_undo_black_24dp/ios/ic_undo.imageset/ic_undo_3x.png";
const SUBMIT_IMAGE_URI = "http://flubstep.com/images/ic_done_black_24dp/ios/ic_done.imageset/ic_done_3x.png";


class ActionChooser extends React.Component {

  render() {
    if (this.props.restartAvailable) {
      return (
        <RestartButton
          loading={this.props.loading}
          restart={this.props.restart}
        />
      );
    } else {
      return (
        <View style={[BaseStyles.centerContent, styles.actionChooser]}>
          <ActionButton
            disabled={this.props.disabled}
            uri={BACKSPACE_IMAGE_URI}
            onPress={Actions.backspace}
          />
          <ActionButton
            disabled={this.props.disabled}
            uri={SHUFFLE_IMAGE_URI}
            onPress={Actions.shuffle}
          />
          <ActionButton
            disabled={this.props.disabled}
            uri={SUBMIT_IMAGE_URI}
            onPress={Actions.submitWord}
          />
        </View>
      );
    }
  }
}

class RestartButton extends React.Component {

  render() {
    return (
      <View style={BaseStyles.centerContent, styles.actionChooser}>
        <TouchableHighlight
          style={[
            BaseStyles.centerContent,
            styles.actionButtonContainer,
            styles.restartButtonContainer
          ]}
          onPress={this.props.restart}
          >
          <Text style={BaseStyles.largeText}>
            {this.props.loading ? "Loading..." : "Play Again?"}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}


class WordChooser extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.wordChooserContainer}>
        <WordChoice
          letters={this.props.wordChoice}
        />
        <View style={styles.buttonsContainer}>
          <View style={[BaseStyles.centerContent, styles.letterChooserContainer]}>
            {this.props.wordChooser.map((letter, index) => {
              return (
                <LetterChooser
                  key={index}
                  disabled={this.props.gameDone}
                  letterObject={letter}
                />
              );
            })}
          </View>
          <ActionChooser
            restart={this.props.restartGame}
            restartAvailable={this.props.restartAvailable}
            loading={this.props.loading}
            disabled={this.props.gameDone}
          />
        </View>
      </View>
    );
  }

}

let styles = StyleSheet.create({

  wordChooserContainer: {
    height: Dimensions.windowHeight/8*3,
    width: Dimensions.windowWidth,
    backgroundColor: Colors.midBackground
  },
  wordChoiceContainer: {
    height: 54,
    width: Dimensions.windowWidth,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    flexDirection: 'row',
    backgroundColor: Colors.white
  },
  buttonsContainer: {
    height: (Dimensions.windowHeight/8*3) - 54,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  letterChoice: {
    height: 54-2,
    marginRight: 4,
    marginLeft: 4
  },
  letterChooserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.windowWidth,
    marginTop: 8
  },
  letterChooser: {
    height: 54, // TODO: constants
    width: 40,
    borderWidth: 0,
    borderColor: Colors.dark,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginRight: 4,
    marginLeft: 4
  },
  actionChooser: {
    flexDirection: 'row',
    marginTop: 8
  },
  actionButtonContainer: {
    height: 54,
    width: 54,
    borderWidth: 0,
    borderColor: Colors.dark,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: Colors.white
  },
  actionButton: {
    height: 36,
    width: 36
  },
  restartButtonContainer: {
    width: 54 * 3 + 4 * 2
  }

});

module.exports = WordChooser;
