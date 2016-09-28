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