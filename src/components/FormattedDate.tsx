// import React from "react";

type Props = {
  isoString: string;
  timeZone?: string;  // Zona waktu, Default: Asia/Jakarta
  locale?: string;  // Default: id-ID
  withTime?: boolean;  // tampilkan jam, Default: true
  separator?: string;  // pemisah tanggal, Default: /
};

function FormattedDate({
  isoString,
  timeZone = "Asia/Jakarta",
  locale = "id-ID",
  withTime = true,
  separator = "/",
}: Props) {
  const date = new Date(isoString);

  const day = date.toLocaleString(locale, {
    day: "2-digit",
    timeZone
  });

  const month = date.toLocaleString(locale, {
    month: "2-digit",
    timeZone
  });

  const year = date.toLocaleString(locale, {
    year: "numeric",
    timeZone
  });

  const dateStr = `${day}${separator}${month}${separator}${year}`

  const timeStr = withTime ? date.toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }) : "";

  return (
    <span>
      { withTime ? `${dateStr}, ${timeStr}` : `${dateStr}` }
    </span>
  )
}

export default FormattedDate;