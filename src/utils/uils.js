export const likeMusic = async (e) => {
  e.preventDefault();
  e.target.classList.remove("active")
  e.target.nextElementSibling.classList.add("active")
};
// UNLike
export const unLikeMusic = async (e) => {
  e.preventDefault();
  if (e.target.tagName === "path") {
    e.target.parentElement.classList.remove("active")
    e.target.parentElement.previousElementSibling.classList.add("active")
  } else {
    e.target.classList.remove("active")
    e.target.previousElementSibling.classList.add("active")
  }
};

// ROUND UP NUMBER
export function numRound(num) {
  num = Math.abs(Number(num))
  const billions = num / 1.0e+9
  const millions = num / 1.0e+6
  const thousands = num / 1.0e+3
  return num >= 1.0e+9 && billions >= 100 ? Math.round(billions) + "B"
    : num >= 1.0e+9 && billions >= 10 ? billions.toFixed(1) + "B"
      : num >= 1.0e+9 ? billions.toFixed(2) + "B"
        : num >= 1.0e+6 && millions >= 100 ? Math.round(millions) + "M"
          : num >= 1.0e+6 && millions >= 10 ? millions.toFixed(1) + "M"
            : num >= 1.0e+6 ? millions.toFixed(2) + "M"
              : num >= 1.0e+3 && thousands >= 100 ? Math.round(thousands) + "K"
                : num >= 1.0e+3 && thousands >= 10 ? thousands.toFixed(1) + "K"
                  : num >= 1.0e+3 ? thousands.toFixed(2) + "K"
                    : num.toFixed()
}

