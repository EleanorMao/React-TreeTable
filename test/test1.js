/**
 * Created by elly on 16/6/1.
 */
import React from 'react';
import {expect} from 'chai';
import {shallow, mount, render} from 'enzyme';
import {TreeTable, TreeHeadCol} from '../src/Index';

const defNoDataTable = shallow(
    <TreeTable data={[]} iskey="id">
        <TreeHeadCol dataField="id">test</TreeHeadCol>
    </TreeTable>
);
describe("no-data", function () {
    it("default", function () {
        expect(defNoDataTable.find('.table-tree .table-body-container .table tbody tr td').text()).to.equal('暂无数据');
    });
    it("custom noTextData", function () {
        expect(shallow(
            <TreeTable data={[]} iskey="id" noTextData="No Data">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        ).find('.table-tree .table-body-container .table tbody tr td').text()).to.equal('No Data');
    });
    it("set nextProps `data` empty", function () {
        let table = mount(
            <TreeTable data={[{id: 1}, {id: 2}]} iskey="id">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(table.find('.table-tree .table-body-container .table tbody tr')).to.have.length(2);
        table.setProps({data: []});
        expect(table.find('.table-tree .table-body-container .table tbody tr td').text()).to.equal('暂无数据');
    });
    it("set nextProps `data` have data", function () {
        let table = mount(
            <TreeTable data={[]} iskey="id">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(table.find('.table-tree .table-body-container .table tbody tr td').text()).to.equal('暂无数据');
        table.setProps({data: [{id: 1}, {id: 2}]});
        expect(table.find('.table-tree .table-body-container .table tbody tr')).to.have.length(2);
    });
});

describe("lineWrap", function () {
    it("default", function () {
        expect(defNoDataTable.hasClass('ellipsis')).to.equal(true);
    });
    it("custom lineWrap", function () {
        expect(shallow(
            <TreeTable data={[]} iskey="id" lineWrap="break">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        ).hasClass('break')).to.equal(true);
    });
});

describe("nestedHead", function () {
    it("default", function () {
        expect(defNoDataTable.find('.table-nestedHead')).to.have.length(0);
    });
    it("custom nestedHead", function () {
        let simpleNestedTable = mount(
            <TreeTable data={[]} iskey="id" nestedHead={[]}>
                <TreeHeadCol dataField="id">test</TreeHeadCol>
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(simpleNestedTable.find('.table-nestedHead')).to.have.length(0);
        simpleNestedTable.setProps({
            nestedHead: [['test', 'test'], ['test', 'test']]
        });
        expect(simpleNestedTable.find('.table-nestedHead')).to.have.length(1);
        expect(simpleNestedTable.find('.table-nestedHead table thead tr')).to.have.length(2);
        expect(simpleNestedTable.find('.table-nestedHead table thead tr').children()).to.have.length(4);
        simpleNestedTable.setProps({
            nestedHead: [['test', {label: 'test', rowspan: 2}], [{label: 'test'}]]
        });
        expect(simpleNestedTable.find('.table-nestedHead table thead tr').children()).to.have.length(3);
    });
});

describe("isTree && key", function () {
    const arr = [1, 2];
    it("default", function () {
        expect(defNoDataTable.instance().props.isTree).to.equal(true);
    });
    it("set to false then to true", function () {
        let normalTable = shallow(
            <TreeTable data={[{id: 1}, {id: 2}]} iskey="id" isTree={false}>
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(normalTable.instance().props.isTree).to.equal(false);
        expect(normalTable.state('dictionary').length).to.equal(0);
        normalTable.setProps({isTree: true});
        let dic = normalTable.state('dictionary');
        expect(dic.length).to.equal(2);
        dic.map((item, i) => {
            expect(item).to.equal(arr[i]);
        });
    });
    it("hashKey", function () {
        let dic = shallow(
            <TreeTable data={[{id: 1}, {id: 2}]} hashKey={true}>
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        ).state('dictionary');
        expect(dic.length).to.equal(2);
        expect(dic[0] === dic[1]).to.equal(false);
        dic.map((item, i) => {
            expect(item === arr[i]).to.equal(false);
        });
    });
});

describe("width && height", function () {
    it("set width && height", function () {
        let table = shallow(
            <TreeTable data={[{id: 1}, {id: 2}]} iskey="id" width="200px" height="50px">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(table.instance().props.width).to.equal('200px');
        expect(table.instance().props.height).to.equal('50px');
        table.setProps({width: 200, height: 50});
        expect(table.instance().props.width).to.equal(200);
        expect(table.instance().props.height).to.equal(50);
    });
});

describe("title && footer", function () {
    it("default", function () {
        expect(defNoDataTable.hasClass('table-tree-title')).to.equal(false);
        expect(defNoDataTable.hasClass('table-tree-footer')).to.equal(false);
    });
    it("title && footer", function () {
        let table = shallow(
            <TreeTable data={[{id: 1}, {id: 2}]} iskey="id"
                       footer={()=> {
                           return '脚'
                       }} title={()=> {
                return '头'
            }}
            >
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(table.find('.table-tree-title').text()).to.equal('头');
        expect(table.find('.table-tree-footer').text()).to.equal('脚');
    });
});

describe("hover", function () {
    it("default", function () {
        let table = (
            <TreeTable data={[{id: 1}, {id: 2}]} iskey="id">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(shallow(table).instance().props.hover).to.equal(true);
        let mounted = mount(table), tr = mounted.find('.table-body-container .table tbody tr');
        expect(mounted.state('isHover')).to.equal(null);
        tr.first().simulate('mouseover');
        expect(mounted.state('isHover')).to.equal(1);
        tr.first().simulate('mouseout');
        expect(mounted.state('isHover')).to.equal(null);
        tr.last().simulate('mouseover');
        expect(mounted.state('isHover')).to.equal(2);
        tr.last().simulate('mouseout');
        expect(mounted.state('isHover')).to.equal(null);
    });
    it("hover when hashKey", function () {
        let table = (
            <TreeTable data={[{id: 1}, {id: 2}]} iskey="id" hashKey={true}>
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(shallow(table).instance().props.hover).to.equal(true);
        let mounted = mount(table), tr = mounted.find('.table-body-container .table tbody tr');
        expect(mounted.state('isHover')).to.equal(null);
        tr.first().simulate('mouseover');
        expect(mounted.state('isHover') === 1).to.equal(false);
        tr.first().simulate('mouseout');
        expect(mounted.state('isHover')).to.equal(null);
        tr.last().simulate('mouseover');
        expect(mounted.state('isHover') === 2).to.equal(false);
        tr.last().simulate('mouseout');
        expect(mounted.state('isHover')).to.equal(null);
    });
    it("set to false", function () {
        let table = (
            <TreeTable data={[{id: 1}, {id: 2}]} iskey="id" hover={false}>
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        expect(shallow(table).instance().props.hover).to.equal(false);
        let mounted = mount(table), tr = mounted.find('.table-body-container .table tbody tr');
        expect(mounted.state('isHover')).to.equal(null);
        tr.first().simulate('mouseover');
        expect(mounted.state('isHover')).to.equal(null);
        tr.first().simulate('mouseout');
        expect(mounted.state('isHover')).to.equal(null);
        tr.last().simulate('mouseover');
        expect(mounted.state('isHover')).to.equal(null);
        tr.last().simulate('mouseout');
        expect(mounted.state('isHover')).to.equal(null);
    });
});

describe("expand", function () {
    it("default", function () {
        let table = (
            <TreeTable data={[{id: 1}, {id: 2, list: [{id: 3}]}]} iskey="id">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        let mounted = mount(table);
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(2);
        expect(mounted.find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-arrow .fa-chevron-down').length).to.equal(1);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('test12');
        mounted.find('.table-body-container .table tbody tr').at(1).find('.table-arrow').simulate('click');
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(3);
        expect(mounted.find('.table-arrow').length).to.equal(1);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('test123');
    });
    it("arrowRender", function () {
        let table = (
            <TreeTable data={[{id: 1}, {id: 2, list: [{id: 3}]}]}
                       arrowRender={(open)=> {
                           return <span className="arrowRender">{open ? '关闭' : '打开'}</span>
                       }}
                       iskey="id">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        let mounted = mount(table);
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(2);
        expect(mounted.find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-arrow .arrowRender').length).to.equal(1);
        expect(mounted.find('.table-arrow .arrowRender').text()).to.equal('打开');
        expect(mounted.text().replace(/\s+/g, '').replace('打开', '')).to.equal('test12');
        mounted.find('.table-body-container .table tbody tr').at(1).find('.arrowRender').simulate('click');
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(3);
        expect(mounted.find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.arrowRender').length).to.equal(1);
        expect(mounted.find('.table-arrow .arrowRender').text()).to.equal('关闭');
        expect(mounted.text().replace(/\s+/g, '').replace('关闭', '')).to.equal('test123');
    });
    it("childrenPropertyName", function () {
        let table = (
            <TreeTable data={[{id: 1}, {id: 2, a: [{id: 3}]}]}
                       childrenPropertyName="a"
                       iskey="id">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
            </TreeTable>
        );
        let mounted = mount(table);
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(2);
        expect(mounted.find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-arrow .fa-chevron-down').length).to.equal(1);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('test12');
        mounted.find('.table-body-container .table tbody tr').at(1).find('.table-arrow').simulate('click');
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(3);
        expect(mounted.find('.table-arrow').length).to.equal(1);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('test123');
    });
    it("startArrowCol", function () {
        let table = (
            <TreeTable data={[{id: 1, a: 11}, {id: 2, a: 22, list: [{id: 3, a: 33}]}]}
                       startArrowCol={1}
                       iskey="id">
                <TreeHeadCol dataField="id">test</TreeHeadCol>
                <TreeHeadCol dataField="a">test</TreeHeadCol>
            </TreeTable>
        );
        let mounted = mount(table);
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(2);
        expect(mounted.find('.table-body-container .table tbody tr').find('td').length).to.equal(4);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(0).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(1).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-arrow .fa-chevron-down').length).to.equal(1);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('testtest111222');
        mounted.find('.table-body-container .table tbody tr').at(1).find('.table-arrow').simulate('click');
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(3);
        expect(mounted.find('.table-body-container .table tbody tr').find('td').length).to.equal(6);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(0).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(1).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-arrow').length).to.equal(1);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('testtest111222333');
    });
    it("showArrow bool", function () {
        //TODO: 真正的强制加箭头吗?
        let table = (
            <TreeTable data={[{id: 1, a: 11}, {id: 2, a: 22, list: [{id: 3, a: 33}]}]} iskey="id">
                <TreeHeadCol dataField="id" showArrow={true}>test</TreeHeadCol>
                <TreeHeadCol dataField="a" showArrow={false}>test</TreeHeadCol>
            </TreeTable>
        );
        let mounted = mount(table);
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(2);
        expect(mounted.find('.table-body-container .table tbody tr').find('td').length).to.equal(4);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-arrow .fa-chevron-down').length).to.equal(2);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('testtest111222');
        mounted.find('.table-body-container .table tbody tr').at(1).find('.table-arrow').simulate('click');
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(3);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-body-container .table tbody tr').at(2).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(2).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-arrow .fa-chevron-down').length).to.equal(3);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('testtest111222333');
    });
    it("showArrow bool2", function () {
        let table = (
            <TreeTable data={[{id: 1, a: 11}, {id: 2, a: 22, list: [{id: 3, a: 33}]}]} iskey="id">
                <TreeHeadCol dataField="id" showArrow={false}>test</TreeHeadCol>
                <TreeHeadCol dataField="a" showArrow={true}>test</TreeHeadCol>
            </TreeTable>
        );
        let mounted = mount(table);
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(2);
        expect(mounted.find('.table-body-container .table tbody tr').find('td').length).to.equal(4);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-arrow .fa-chevron-down').length).to.equal(2);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('testtest111222');
        mounted.find('.table-body-container .table tbody tr').at(1).find('.table-arrow').simulate('click');
        expect(mounted.find('.table-body-container .table tbody tr').length).to.equal(3);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(0).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(1).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-body-container .table tbody tr').at(2).find('td').at(0).find('.table-arrow').length).to.equal(1);
        expect(mounted.find('.table-body-container .table tbody tr').at(2).find('td').at(1).find('.table-arrow').length).to.equal(0);
        expect(mounted.find('.table-arrow .fa-chevron-down').length).to.equal(3);
        expect(mounted.text().replace(/\s+/g, '')).to.equal('testtest111222333');
    });
});