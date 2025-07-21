import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import useFormFields from "@/hooks/useFormFields";
import transformAddress, { RawAddressModel } from "./core/models/address";
import { Address as AddressType } from "./types";

function App() {
  const {
    fields,
    handleChange,
    resetFields,
  } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const [loading, setLoading] = React.useState(false);
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddresses([]);
    setError(undefined);
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL;
      const url = `${baseUrl}/api/getAddresses?postcode=${fields.postCode}&streetnumber=${fields.houseNumber}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data: { status: string; details: RawAddressModel[] } = await response.json();
      const transformed = data.details.map(transformAddress);

      setAddresses(transformed);
    } catch {
      setError("Could not fetch addresses. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fields.firstName.trim() || !fields.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!fields.selectedAddress || !addresses.length) {
      setError("No address selected. Try selecting or finding one.");
      return;
    }

    const foundAddress = addresses.find((address) => address.id === fields.selectedAddress);
    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName: fields.firstName, lastName: fields.lastName });
  };

  const addressFormEntries = [
    {
      name: "postCode",
      placeholder: "Post Code",
      extraProps: {
        name: "postCode",
        value: fields.postCode,
        onChange: handleChange,
      },
    },
    {
      name: "houseNumber",
      placeholder: "House number",
      extraProps: {
        name: "houseNumber",
        value: fields.houseNumber,
        onChange: handleChange,
      },
    },
  ];

  const personFormEntries = [
    {
      name: "firstName",
      placeholder: "First name",
      extraProps: {
        name: "firstName",
        value: fields.firstName,
        onChange: handleChange,
      },
    },
    {
      name: "lastName",
      placeholder: "Last name",
      extraProps: {
        name: "lastName",
        value: fields.lastName,
        onChange: handleChange,
      },
    },
  ];

  const handleClearAllFields = () => {
    resetFields();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={addressFormEntries}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {fields.selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={personFormEntries}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}
        {error && <ErrorMessage message={error} />}
        <Button
          variant="secondary"
          type="button"
          onClick={handleClearAllFields}
        >
          Clear all fields
        </Button>
      </Section>
      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
