'use strict';

const Homey = require('homey');
const SonyBraviaAndroidTvCommunicator = require('./helpers/sony-bravia-android-tv-communicator');
const SonyBraviaFlowActions = require('../../definitions/flow-actions');

class SonyBraviaAndroidTvApp extends Homey.App {

    async onInit() {
        this.log('SonyBraviaAndroidTvApp is running...');
        await this.registerFlowListeners();
    }

    async registerFlowListeners() {
        SonyBraviaFlowActions.forEach(flow => {
            try {
                const flowCard = this.homey.flow.getActionCard(flow.action);

                flowCard.registerRunListener(async (args, state) => {
                    try {
                        flow.parsedCommand = flow.command;

                        if (flow.command instanceof Function) {
                            flow.parsedCommand = flow.command(args, state)
                        }

                        this.log(`${this.homey.manifest.id} - ${this.homey.manifest.version}: starting flow: ${flow.action} and sending command: `, flow.parsedCommand);

                        return await SonyBraviaAndroidTvCommunicator.sendCommand(args.device, flow.parsedCommand);
                    } catch (err) {
                        this.log(`${this.homey.manifest.id} - ${this.homey.manifest.version}: flow command could not be executed: `, flow, err);
                    }
                });
            } catch (err) {
                this.log(`${this.homey.manifest.id} - ${this.homey.manifest.version}: flow command could not be registered: `, flow, err);
            }
        });
    }

}

module.exports = SonyBraviaAndroidTvApp;
