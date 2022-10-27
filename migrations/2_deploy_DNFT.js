const DNFT = artifacts.require("DNFT");

module.exports = async (deployer, network, [defaultAccount]) => {
    deployer.deploy(DNFT);
}