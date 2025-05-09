// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    address public distributor;
    address public retailer;

    struct Item {
        uint itemId;
        string itemName;
        uint itemMfD;
        uint itemExpD;
        uint totalQty;
        uint distributorQty;
        uint retailerQty;
        uint customerQty;
        address currentOwner;
        int minTemp;
        int maxTemp;
        bool isBlocked;
    }

    mapping(uint => Item) public items;
    mapping(string => uint) private itemNameToId;

    event ItemAdded(uint indexed itemId, string itemName, uint totalQty);
    event ItemBlocked(uint indexed itemId, string reason);
    event OwnershipTransferred(uint indexed itemId, address previousOwner, address newOwner);

    modifier onlyDistributor() {
        require(msg.sender == distributor, "Only distributor can call this function");
        _;
    }

    modifier onlyRetailer() {
        require(msg.sender == retailer, "Only retailer can call this function");
        _;
    }

    function setDistributor(address _distributor) public {
        distributor = _distributor;
    }

    function setRetailer(address _retailer) public {
        retailer = _retailer;
    }

    function getCurrentDate() internal view returns (uint) {
        uint timestamp = block.timestamp;
        uint year = 1970 + timestamp / 31556926;
        uint month = (timestamp / 2629743) % 12 + 1;
        uint day = (timestamp / 86400) % 31 + 1;
        return year * 10000 + month * 100 + day;
    }

    function addItem(
        uint _itemId,
        string memory _itemName,
        uint _mfDate,
        uint _expDate,
        uint _totalQty,
        int _minTemp,
        int _maxTemp
    ) public onlyDistributor {
        require(items[_itemId].itemId == 0, "Item ID already exists");
        require(itemNameToId[_itemName] == 0, "Item name already exists");
        require(_mfDate < _expDate, "Manufacturing date must be before expiry date");

        items[_itemId] = Item(
            _itemId, _itemName, _mfDate, _expDate, _totalQty,
            _totalQty, 0, 0, distributor,
            _minTemp, _maxTemp, false
        );

        itemNameToId[_itemName] = _itemId;
        emit ItemAdded(_itemId, _itemName, _totalQty);
    }

    function accessItem(uint _itemId, uint _qty, int sensedTemperature) public onlyRetailer {
        require(items[_itemId].itemId != 0, "Item does not exist");
        require(!items[_itemId].isBlocked, "Item is blocked");
        require(items[_itemId].distributorQty >= _qty, "Insufficient quantity");
        require(items[_itemId].currentOwner == distributor, "Item not with distributor");

        uint todayDate = getCurrentDate();
        if (sensedTemperature < items[_itemId].minTemp || sensedTemperature > items[_itemId].maxTemp || todayDate > items[_itemId].itemExpD) {
            items[_itemId].isBlocked = true;
            emit ItemBlocked(_itemId, "Temperature or expiry issue");
            return;
        }

        items[_itemId].distributorQty -= _qty;
        items[_itemId].retailerQty += _qty;
        items[_itemId].currentOwner = retailer;
        emit OwnershipTransferred(_itemId, distributor, retailer);
    }

    function claimOwnershipByName(string memory _itemName, uint _qty, int sensedTemperature) public {
        uint _itemId = getItemIdByName(_itemName);
        require(_itemId != 0, "Item does not exist");
        require(!items[_itemId].isBlocked, "Item is blocked");
        require(items[_itemId].retailerQty >= _qty, "Insufficient quantity");
        require(items[_itemId].currentOwner == retailer, "Item not with retailer");

        uint todayDate = getCurrentDate();
        if (sensedTemperature < items[_itemId].minTemp || sensedTemperature > items[_itemId].maxTemp || todayDate > items[_itemId].itemExpD) {
            items[_itemId].isBlocked = true;
            emit ItemBlocked(_itemId, "Temperature or expiry issue");
            return;
        }

        items[_itemId].retailerQty -= _qty;
        items[_itemId].customerQty += _qty;
        items[_itemId].currentOwner = msg.sender;
        emit OwnershipTransferred(_itemId, retailer, msg.sender);
    }

    function getItemDetails(uint _itemId) public view returns (
        string memory itemName,
        uint manufacturingDate,
        uint expiryDate,
        uint totalQuantity,
        uint distributorStock,
        uint retailerStock,
        uint customerStock,
        int minTemperature,
        int maxTemperature,
        bool isItemBlocked
    ) {
        require(items[_itemId].itemId != 0, "Item does not exist");
        Item memory item = items[_itemId];
        return (
            item.itemName, item.itemMfD, item.itemExpD,
            item.totalQty, item.distributorQty, item.retailerQty,
            item.customerQty, item.minTemp, item.maxTemp, item.isBlocked
        );
    }

    function getItemIdByName(string memory _itemName) public view returns (uint) {
        require(itemNameToId[_itemName] != 0, "Item does not exist");
        return itemNameToId[_itemName];
    }
}
