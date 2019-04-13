// require('./hackRequire.js')

const Module = require('module');
// console.log(require('chalk') === require('*/chalk'))
const expect = require('chai').expect
const Reporter = require('./Reporter')
const beforRequire = Module.prototype.require

Reporter.setOptions({
    logLevel: 0
})
describe('hack require test', () => {
    beforeEach(() => {

        delete require.cache[require.resolve('./hackRequire.js')];
    })
    it('hack should work', () => {
        const noHackCommander = require('commander')
        const { cancelHack } = require('./hackRequire')
        const HackCommander = require('*/commander')
        expect(noHackCommander === HackCommander).equal(true)
        cancelHack() 
        // Module.prototype.require = beforRequire
    })
    it('hackCancel should work', () => {
        
        const noHackCommander = require('commander')
        const { cancelHack } = require('./hackRequire')
        const HackCommander = require('*/commander')
        expect(noHackCommander === HackCommander).equal(true)
        cancelHack()
        expect(Module.prototype.require === beforRequire).equal(true)
    })
    it('alias default unwork', () => {
        function throwError() {
            try {
                require('*/commander')
            } catch(e){
                throw e
            }
        }
        
            // console.log(e)
        expect(throwError).to.throw(Error)
        expect(throwError).to.throw(/Cannot\sfind\smodule/);
    })
})
