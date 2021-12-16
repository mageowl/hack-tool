const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const words = [
	"HACKER123",
	"OWENHACKS",
	"IP=127.0.0.1",
	"ADMIN",
	"SECURITY",
	"PASSWORDBREACHED",
	"USER.REMOVE()",
	"NAMEFOUND",
	"SEEPRIVATEDATA",
	"COMPUTER(123).RESETPASSWORD()",
	"INSTALLZSH.JS",
	"JAVASCRIPTENABLED"
];

export default function createWord() {
	let word;
	if (Math.random() > 0.2) {
		word = Array(Math.floor(Math.random() * 10) + 5)
			.fill("m")
			.map(() => characters.at(Math.floor(Math.random() * 36)))
			.join("");
	} else {
		word = words[Math.floor(Math.random() * 10)];
	}
	return word + " ".repeat(Math.floor(Math.random() * 5) + 10);
}
