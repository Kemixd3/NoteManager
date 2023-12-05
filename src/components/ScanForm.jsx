import { useFormContext } from "react-hook-form";

const ScanForm = ({ addLine }) => {
  //Getting context from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useFormContext();

  const onSubmit = (data) => {
    console.log(data);
    addLine(data.scannedBarcode, data.quantity); //Emit addLine with scanned barcode and quantity values
    reset(); //Reset form after submission
  };

  const handleBarcodeScan = (event) => {
    if (event.keyCode === 13 && event.target.value.trim() !== "") {
      onSubmit({
        scannedBarcode: event.target.value,
        quantity: event.target.form.querySelector("[name='quantity']").value,
      });
      event.target.value = ""; //Clear scanned barcode input field
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      className="container"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <input
          type="text"
          {...register("quantity", {
            required: true,
            pattern: /^[0-9]+$/,
            value: 1,
          })}
          placeholder="Enter Quantity"
        />
        {errors.quantity && <span>Quantity must be an integer.</span>}
        <input
          type="text"
          {...register("scannedBarcode", { required: true })}
          placeholder="Scan here"
          onKeyDown={handleBarcodeScan}
          autoFocus
        />
        {errors.scannedBarcode && <span>Scanned barcode is required.</span>}
      </div>
      <div hidden className="mt-5">
        <button type="submit">Submit Form</button>
      </div>
    </form>
  );
};

export default ScanForm;
