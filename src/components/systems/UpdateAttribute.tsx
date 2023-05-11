import { useEditPopoverContext } from "~/components/systems/EditPopover";
import React from "react";
import { ActionIcon, NumberInput, TextInput } from "@mantine/core";
import { CheckFat } from "@phosphor-icons/react";

interface UpdateAttributeProps<T> {
  placeholder?: string;
  updateAttribute: (value: T) => void;
  width?: string;
}

export function UpdateString({
  width = "7rem",
  updateAttribute,
  placeholder = "New Value",
}: UpdateAttributeProps<string>): JSX.Element {
  const { handles } = useEditPopoverContext();
  const [value, setValue] = React.useState<string>("");

  const onCommit = () => {
    updateAttribute(value);
    setValue("");
    handles.close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handles.close();
      setValue("");
      return;
    }
    if (e.key === "Enter") {
      onCommit();
    }
  };
  return (
    <>
      <TextInput
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        styles={{ input: { width, textAlign: "center" } }}
        value={value}
        onKeyDown={handleKeyDown}
      />
      <ActionIcon title="Set Value" onClick={onCommit}>
        <CheckFat size="1.75rem" />
      </ActionIcon>
    </>
  );
}

export function UpdateNumber({
  width = "6rem",
  updateAttribute,
  placeholder = "New Value",
}: UpdateAttributeProps<number | null>): JSX.Element {
  const { handles } = useEditPopoverContext();
  const [value, setValue] = React.useState<number | null>(null);

  const onCommit = () => {
    updateAttribute(value);
    setValue(null);
    handles.close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handles.close();
      setValue(null);
      return;
    }
    if (e.key === "Enter") {
      onCommit();
    }
  };
  return (
    <>
      <NumberInput
        hideControls
        onChange={(v) => setValue(v === "" ? null : v)}
        placeholder={placeholder}
        styles={{ input: { width, textAlign: "center" } }}
        value={value === null ? "" : value}
        onKeyDown={handleKeyDown}
      />
      <ActionIcon title="Set Value" onClick={onCommit}>
        <CheckFat size="1.75rem" />
      </ActionIcon>
    </>
  );
}
