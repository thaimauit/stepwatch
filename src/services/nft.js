import apis from './apis';
import request from './request';

export const getListBaseNft = () => request(apis.nft.listBaseNft);

export const getMyNfts = () => request(apis.nft.myNfts);
export const getMyBoxs = () => request(apis.nft.myBoxs);

export const repair = id => request(apis.nft.repair(id), { method: 'PUT' });

export const nftDetail = (id, isBox) => request(apis.nft.nftDetail(id, isBox));

export const unBox = id => request(apis.nft.unBox(id), { method: 'PUT' });
