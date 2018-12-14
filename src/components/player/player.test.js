import React from 'react';
import { shallow } from 'enzyme';
import Player from 'app/components/player';

describe('Player specs', () => {
  it('Should render the player', () => {
    const Component = shallow(<Player />);
    expect(Component.html()).toBeDefined();
  });
});
