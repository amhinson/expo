import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { Platform } from 'react-native';
import TestSuite from 'test-suite/AppNavigator';

import Colors from './src/constants/Colors';

type NavigationRouteConfigMap = React.ReactElement;

type RoutesConfig = {
  'test-suite': NavigationRouteConfigMap;
  apis?: NavigationRouteConfigMap;
  components?: NavigationRouteConfigMap;
};

type NativeComponentListExportsType = null | {
  [routeName: string]: NavigationRouteConfigMap;
};

function optionalRequire(requirer: () => { default: React.ComponentType }) {
  try {
    return requirer().default;
  } catch (e) {
    return null;
  }
}

const routes: RoutesConfig = {
  'test-suite': TestSuite,
};

// We'd like to get rid of `native-component-list` being a part of the final bundle.
// Otherwise, some tests may fail due to timeouts (bundling takes significantly more time).
// See `babel.config.js` and `moduleResolvers/nullResolver.js` for more details.
const NativeComponentList: NativeComponentListExportsType = optionalRequire(() =>
  require('native-component-list/src/navigation/MainNavigators')
) as any;
const Redirect = optionalRequire(() =>
  require('native-component-list/src/screens/RedirectScreen')
) as any;

if (NativeComponentList) {
  routes.apis = NativeComponentList.apis;
  routes.components = NativeComponentList.components;
}

const Tab = createBottomTabNavigator();

const Switch = createStackNavigator();

const linking = {
  prefixes: [Platform.select({ web: Linking.makeUrl('/'), default: 'bareexpo://' })],
  config: {
    main: {
      path: '',
      initialRouteName: 'test-suite',
      screens: {
        apis: {
          initialRouteName: 'ExpoApis',
          screens: {
            ExpoApis: '',
          },
        },
        components: {
          initialRouteName: 'ExpoComponents',
          screens: {
            ExpoComponents: '',
            GL: '/gl',
            SVG: '/svg',
            SVGExample: '/svg/example',
          },
        },
      },
    },
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Colors.activeTintColor,
        inactiveTintColor: Colors.inactiveTintColor,
        safeAreaInsets: {
          top: 5,
        },
      }}
      initialRouteName="test-suite">
      {Object.keys(routes).map(name => (
        <Tab.Screen
          name={name}
          key={name}
          component={routes[name]}
          options={routes[name].navigationOptions}
        />
      ))}
    </Tab.Navigator>
  );
}

export default () => (
  <NavigationContainer linking={linking}>
    <Switch.Navigator headerMode="none" initialRouteName="main">
      {Redirect && <Switch.Screen name="redirect" component={Redirect} />}
      <Switch.Screen name="main" component={TabNavigator} />
    </Switch.Navigator>
  </NavigationContainer>
);
