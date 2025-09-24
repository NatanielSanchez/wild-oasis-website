import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="z-10 flex items-center gap-4">
      <Image
        height="60"
        width="60"
        src="/logo.png"
        alt="The Wild Oasis logo"
        quality={100}
      />
      <span className="text-xl font-semibold text-primary-100">
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
