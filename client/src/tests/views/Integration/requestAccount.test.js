import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SingUp from '../../../components/SignUp'

Enzyme.configure({adapter: new Adapter() });


describe("<SingUp />", () => {
    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState")
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        wrapper = Enzyme.mount(<SingUp />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Title input", () => {
        it("Should capture email correctly onChange", () => {
           wrapper.find("TextField").at(0).simulate('change', {
                target: {
                    value: 'j.p.garciap@udc.es'
                }
            });
            expect(setState).toHaveBeenCalledWith("j.p.garciap@udc.es");
        //console.log(wrapper.find("TextField"));
        });

    });


});