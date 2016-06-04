/**
 * Created by elly on 16/6/1.
 */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import TreeTable from '../src/Index';

describe("Shallow TreeTable", function() {
    it("work well when no data", function() {
        expect(shallow(<TreeTable data={[]}/>).find('.table-row').text()).to.equal('暂无数据');
    });

});