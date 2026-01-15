// Default avatar images for new users
export const defaultAvatars = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Bailey",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Dusty",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Frank",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Grace",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Henry",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Ivy",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Katie",
];

// Get a random avatar from the list
export const getRandomAvatar = (): string => {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    return defaultAvatars[randomIndex];
};
