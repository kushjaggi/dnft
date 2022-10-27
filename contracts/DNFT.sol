// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DNFT is ERC721, ERC721URIStorage {

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("DNFTs","dNFT") {
  }

  function safeMint(address to, string memory _tokenUri) public {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to,tokenId);
    _setTokenURI(tokenId, _tokenUri);
  }

  function updateNFT(uint256 _tokenId, string memory _newUri) public {
    _setTokenURI(_tokenId,_newUri);
  }

  function _burn(uint256 tokenId)
    internal
    override(ERC721, ERC721URIStorage)
  {
      super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
      public
      view
      override(ERC721, ERC721URIStorage)
      returns (string memory)
  {
      return super.tokenURI(tokenId);
  }


}
