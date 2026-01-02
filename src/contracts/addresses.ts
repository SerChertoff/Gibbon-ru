/**
 * Адреса смарт-контрактов для разных сетей
 * 
 * Здесь вы можете добавить адреса ваших контрактов
 * Пример: ERC-20 токены, NFT контракты и т.д.
 */

// Пример: адреса популярных ERC-20 токенов для тестирования
export const ERC20_CONTRACTS: { [chainId: number]: { [tokenName: string]: string } } = {
  // Sepolia Testnet
  11155111: {
    // USDC на Sepolia (пример)
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    // Добавьте свои токены здесь
  },
  // Goerli Testnet
  5: {
    // Пример токена
    TEST_TOKEN: '0x0000000000000000000000000000000000000000',
  },
  // Ethereum Mainnet
  1: {
    // USDC на Mainnet
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    // DAI на Mainnet
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  // Polygon Mainnet
  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  // Mumbai Testnet
  80001: {
    // Пример токена
    TEST_TOKEN: '0x0000000000000000000000000000000000000000',
  },
};

/**
 * Получить адрес контракта для конкретной сети
 */
export const getContractAddress = (
  chainId: number,
  tokenName: string
): string | null => {
  return ERC20_CONTRACTS[chainId]?.[tokenName] || null;
};

