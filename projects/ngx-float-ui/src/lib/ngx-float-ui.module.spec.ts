import {minVersion} from "semver";
//
import mainPkg from "../../../../package.json";
import libPkg from "../../package.json";

it("should have matching package versions for @floating-ui/dom", () => {
    const floatUiVersionMain = mainPkg.dependencies["@floating-ui/dom"];
    const floatUiVersionLib = libPkg.dependencies["@floating-ui/dom"];

    expect(floatUiVersionLib).toEqual(floatUiVersionMain);
});

it("should have matching package versions for @angular", () => {

    const angularVersionMain = mainPkg.dependencies["@angular/core"];
    const angularVersionLib = libPkg.peerDependencies["@angular/core"];
    const angularMajorMain = minVersion(angularVersionMain);
    const angularMajorLib = minVersion(angularVersionLib);

    expect(angularMajorLib?.major).not.toBeNull();
    expect(angularMajorMain?.major).not.toBeNull();
    expect(angularMajorLib!.major).toEqual(angularMajorMain!.major);
});


it("should have matching package versions for rxjs", () => {

    const rxjsVersionMain = mainPkg.dependencies.rxjs;
    const rxjsVersionLib = libPkg.peerDependencies.rxjs;

    expect(rxjsVersionLib).toEqual(rxjsVersionMain);
});
